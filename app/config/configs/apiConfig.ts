import {
  createNumberFactAPIConfig,
  NumberFactAPIConfig,
} from "~/config/configs/api/numberFactConfig";

export type APIConfig = {
  numberFact: NumberFactAPIConfig;
};

export const createAPIConfig = (): APIConfig => ({
  numberFact: createNumberFactAPIConfig(),
});
