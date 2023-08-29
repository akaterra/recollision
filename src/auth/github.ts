import express from 'express';
import { Service } from 'typedi';
import { EntityService } from '../entities.service';
import { Autowired, err, requestJson } from '../utils';
import { IntegrationsService } from '../integrations.service';
import { GithubIntegrationService } from '../integrations/github';
import { IAuthStrategyMethod, IAuthStrategyService } from './auth-strategy.service';
import { IUser } from '../user';
import { StoragesService } from '../storages.service';
import fetch from 'node-fetch-native';
import { prepareAuthData } from '../auth.service';

@Service()
export class GithubAuthStrategyService extends EntityService implements IAuthStrategyService {
  static readonly type: string = 'github';

  @Autowired() protected integrationsService: IntegrationsService;
  @Autowired() protected storagesService: StoragesService;

  private get integration() {
    return this.integrationsService.get(this.config?.integration ?? 'default', this.type) as GithubIntegrationService;
  }

  private get storage() {
    return this.storagesService.get(this.config?.storage ?? 'default');
  }

  constructor(protected config?: {
    credentials?: {
      clientId?: string;
      clientSecret?: string;
      callbackUrl?: string;
    };
    integration?: string;
    storage?: string;
  }) {
    super();

    if (config) {
      if (!this.config.credentials) {
        this.config.credentials = {};
      }

      if (!this.config.credentials.clientId) {
        this.config.credentials.clientId = process.env.GITHUB_CLIENT_ID;
      }

      if (!this.config.credentials.clientSecret) {
        this.config.credentials.clientSecret = process.env.GITHUB_CLIENT_SECRET;
      }

      if (!this.config.credentials.callbackUrl) {
        this.config.credentials.callbackUrl = process.env.GITHUB_CALLBACK_URL;
      }
    }
  }

  async authorize(data: Record<string, any>): Promise<IUser> {
    return null;
  }

  async request(): Promise<IAuthStrategyMethod> {
    return {
      id: this.id,
      type: this.type,
      actions: {
        redirect: `https://github.com/login/oauth/authorize?client_id=${this.config?.credentials?.clientId}&client_secret=${this.config?.credentials?.clientSecret}&redirect_uri=${encodeURIComponent(this.config?.credentials?.callbackUrl)}`,
      },
    };
  }

  async configureServer(app: express.Application, path?: string): Promise<void> {
    if (!path) {
      path = `/auth/methods/${this.id ?? this.type}`;
    } else {
      path = `/auth/methods${path}`;
    }

    app.get(path, err(async (req, res) => {
      res.json(await this.request());
    }));

    app.get(path + '/redirect', async (req, res) => {
      res.redirect((await this.request()).actions.redirect);
    });

    app.get(path + '/callback', err(async (req, res) => {
      const githubAuth = await requestJson(
        'https://github.com/login/oauth/access_token',
        {
          client_id: this.config?.credentials?.clientId,
          client_secret: this.config?.credentials?.clientSecret,
          code: req.query.code,
          redirect_uri: this.config?.credentials?.callbackUrl,
        },
        'post',
      );
      const githubUser = await requestJson(
        'https://api.github.com/user',
        undefined,
        'get',
        githubAuth.access_token,
      );

      const user = await this.storage.userGet(String(githubUser.id), this.type);

      if (!user) {
        res.status(401);

        throw new Error('Unauthorized');
      }

      res.json(prepareAuthData(user));
    }));
  }
}