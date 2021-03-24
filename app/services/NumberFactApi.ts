import { RESTDataSource, RequestOptions } from "apollo-datasource-rest";

import { BaseContext } from "~/graphql/context";

export class NumberFactApi extends RESTDataSource<BaseContext> {
  constructor() {
    super();
    this.baseURL = "http://numbersapi.com/";
  }

  protected willSendRequest(request: RequestOptions) {
    request.headers.set("Authorization", this.context.config.numberFact.token);
  }

  public async getFact(params: { number: number }) {
    try {
      const response = await this.get<string>(`/${params.number}/math`);

      return { fact: response, number: params.number };
    } catch (e) {
      this.context.logger.error("Request to external number api failed", e);

      return null;
    }
  }
}
