import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";

import { Maybe } from "~/generation/generated";
import { BaseContext } from "~/graphql/context";

export type FactResponse = {
  fact: string;
  number: number;
};

export class NumberFactApi extends RESTDataSource<BaseContext> {
  constructor() {
    super();
    this.baseURL = "http://numbersapi.com/";
  }

  protected willSendRequest(request: RequestOptions): void {
    request.headers.set("Authorization", this.context.config.numberFact.token);
  }

  public async getFact(params: {
    number: number;
  }): Promise<Maybe<FactResponse>> {
    try {
      const response = await this.get<string>(`/${params.number}/math`);

      return { fact: response, number: params.number };
    } catch (e) {
      this.context.logger.error("Request to external number api failed", e);

      return null;
    }
  }
}
