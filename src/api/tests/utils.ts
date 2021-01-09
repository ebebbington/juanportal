// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const req: any = {
  params: {
    count: null,
    id: null,
  },
  body: {
    name: null,
    description: null,
  },
  file: null,
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const res: any = {
  statusCode: null,
  jsonMessage: null,
  status(statusCode: number) {
    this.statusCode = statusCode;
    return this;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: function (obj: any) {
    this.jsonMessage = obj;
    return this;
  },
  end() {
    return this;
  },
};
export const next = function (): boolean {
  return true;
};
