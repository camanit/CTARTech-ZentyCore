// Package zentycore provides the official Go SDK and Gin Web Middleware
// for CTARTech ZentyCore Zero Trust Control Platform.
package zentycore

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
)

// Client handles Zero Trust Policy evaluations
type Client struct {
	BaseURL    string
	APIKey     string
	HTTPClient *http.Client
}

// PolicyEvaluationRequest matches ZentyCore evaluation payload
type PolicyEvaluationRequest struct {
	UserID    string `json:"user_id"`
	Token     string `json:"token"`
	DeviceID  string `json:"device_id"`
	Resource  string `json:"resource"`
	IPAddress string `json:"ip_address"`
}

// PolicyEvaluationResponse returns access decisions
type PolicyEvaluationResponse struct {
	Allowed          bool   `json:"allowed"`
	OverallRiskScore uint8  `json:"overall_risk_score"`
	Reason           string `json:"reason"`
	SessionID        string `json:"session_id"`
	IsCached         bool   `json:"is_cached"`
}

// NewClient initializes a new Zero Trust SDK instance
func NewClient(baseURL, apiKey string) *Client {
	return &Client{
		BaseURL: strings.TrimRight(baseURL, "/"),
		APIKey:  apiKey,
		HTTPClient: &http.Client{
			Timeout: 3 * time.Second,
		},
	}
}

// EvaluateAccess evaluates an access request against the Control Plane
func (c *Client) EvaluateAccess(req PolicyEvaluationRequest) (*PolicyEvaluationResponse, error) {
	endpoint := fmt.Sprintf("%s/api/v1/policy/evaluate", c.BaseURL)
	
	payloadBytes, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.APIKey))

	res, err := c.HTTPClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	var decision PolicyEvaluationResponse
	if err := json.NewDecoder(res.Body).Decode(&decision); err != nil {
		return nil, err
	}

	return &decision, nil
}

// StandardHTTPMiddleware wraps standard http.HandlerFunc with Zero Trust protection
func (c *Client) StandardHTTPMiddleware(resourceName string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		token := strings.TrimPrefix(authHeader, "Bearer ")
		deviceID := r.Header.Get("X-Device-ID")
		userID := r.Header.Get("X-User-ID")
		if userID == "" {
			userID = "anonymous"
		}
		if deviceID == "" {
			deviceID = "unknown_device"
		}

		clientIP := r.RemoteAddr
		if forwarded := r.Header.Get("X-Forwarded-For"); forwarded != "" {
			clientIP = forwarded
		}

		decision, err := c.EvaluateAccess(PolicyEvaluationRequest{
			UserID:    userID,
			Token:     token,
			DeviceID:  deviceID,
			Resource:  resourceName,
			IPAddress: clientIP,
		})

		if err != nil || !decision.Allowed {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"error":  "FORBIDDEN_ZERO_TRUST_VIOLATION",
				"reason": decision.Reason,
			})
			return
		}

		w.Header().Set("X-ZentyCore-Attested", "true")
		w.Header().Set("X-ZentyCore-Session-ID", decision.SessionID)
		next.ServeHTTP(w, r)
	})
}
