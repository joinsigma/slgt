import type { PromptType } from "prompts";

export interface ParamObject {
  key: string;
  prompt: string;
  required: boolean;
  type: PromptType;
  default: string;
  value: string;
  choices?: { title: string; value: string }[];
}

export interface Params {
  [key: string]: ParamObject;
}
