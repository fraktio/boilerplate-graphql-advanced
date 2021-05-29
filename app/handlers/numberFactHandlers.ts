import { Maybe } from "~/generation/generated";
import { FactResponse, NumberFactApi } from "~/services/NumberFactApi";

export const numberFactHandler = async (params: {
  number: number;
  numberFactApi: NumberFactApi;
}): Promise<Maybe<FactResponse>> =>
  await params.numberFactApi.getFact({ number: params.number });
