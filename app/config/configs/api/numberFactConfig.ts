import { API_NUMBER_FACT_TOKEN } from "~/config/envNames";
import { getEnv } from "~/config/getters";

export type NumberFactAPIConfig = {
  token: string;
};

export const createNumberFactAPIConfig = (): NumberFactAPIConfig => ({
  token: getEnv(API_NUMBER_FACT_TOKEN),
});
