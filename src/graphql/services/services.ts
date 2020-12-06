import { CompanyService } from "./CompanyService";

export type Services = {
  companyService: CompanyService;
};

export const services = (): Services => ({
  companyService: new CompanyService(),
});
