/**
 * @ctartech/zentycore-middleware
 * Zero Trust Security Middleware for Express.js & NestJS
 */

export interface ZeroTrustConfig {
  controlPlaneUrl: string; // e.g. "http://localhost:8080"
  apiKey: string;
}

export interface ZeroTrustEvaluation {
  allowed: boolean;
  overall_risk_score: number;
  reason: string;
  session_id: string;
  is_cached?: boolean;
}

export class ZeroTrustClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(config: ZeroTrustConfig) {
    this.baseUrl = config.controlPlaneUrl.replace(/\/$/, '');
    this.apiKey = config.apiKey;
  }

  async evaluateAccess(params: {
    userId: string;
    token: string;
    deviceId: string;
    resource: string;
    ipAddress: string;
  }): Promise<ZeroTrustEvaluation> {
    const res = await fetch(`${this.baseUrl}/api/v1/policy/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        user_id: params.userId,
        token: params.token,
        device_id: params.deviceId,
        resource: params.resource,
        ip_address: params.ipAddress,
      }),
    });

    if (!res.ok) {
      throw new Error(`ZentyCore API error status: ${res.status}`);
    }

    return (await res.json()) as ZeroTrustEvaluation;
  }

  /**
   * Express.js Zero Trust Guard Middleware
   * Usage: app.use(ztClient.expressMiddleware({ resourceName: 'api:customers' }))
   */
  expressMiddleware(options: { resourceName: string }) {
    return async (req: any, res: any, next: any) => {
      const authHeader = req.headers['authorization'] || '';
      const token = authHeader.replace(/^Bearer\s+/i, '');
      const deviceId = (req.headers['x-device-id'] as string) || 'unknown_device';
      const userId = (req.headers['x-user-id'] as string) || 'anonymous';
      const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';

      try {
        const decision = await this.evaluateAccess({
          userId,
          token,
          deviceId,
          resource: options.resourceName,
          ipAddress,
        });

        if (decision.allowed) {
          req.zentycoreSession = decision;
          res.setHeader('X-ZentyCore-Attested', 'true');
          res.setHeader('X-ZentyCore-Session-ID', decision.session_id);
          next();
        } else {
          res.status(403).json({
            error: 'FORBIDDEN_ZERO_TRUST_VIOLATION',
            reason: decision.reason,
            riskScore: decision.overall_risk_score,
          });
        }
      } catch (err) {
        // Fail-closed Zero Trust
        res.status(403).json({
          error: 'FORBIDDEN_CONTROL_PLANE_UNREACHABLE',
          reason: 'Unable to evaluate zero trust policy.',
        });
      }
    };
  }
}
