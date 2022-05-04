import { BigNumber } from "bignumber.js";

export const convertCudosToACudos = (val) =>
  new BigNumber(val).times(COST_OF_ONE_CUDOS_TO_ACUDOS).toString();

export const convertAcudosToCudos = (val) =>
  new BigNumber(val).div(COST_OF_ONE_CUDOS_TO_ACUDOS).toPrecision(6).toString();

export const COST_OF_ONE_CUDOS_TO_ACUDOS = new BigNumber(10)
  .exponentiatedBy(18)
  .toString();
