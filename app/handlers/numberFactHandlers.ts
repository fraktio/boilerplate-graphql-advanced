import { NumberFactApi } from "~/services/NumberFactApi";

export const numberFactHandler = async (params: {
  number: number;
  numberFactApi: NumberFactApi;
}) => await params.numberFactApi.getFact({ number: params.number });
