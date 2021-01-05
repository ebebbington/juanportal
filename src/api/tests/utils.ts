export const req: {
  params: {
    count: null | number | string,
    id: string | null
  },
  body: {
    name:null | string,
    description: null | string
  },
  file: string | null | { originalname:string}
} = {
  params: {
    count: null,
    id: null,
  },
  body: {
    name: null,
    description: null
  },
  file: null
}
export const res: {
  statusCode: null| number,
  jsonMessage: string | null,
  status: (statusCode: number) => any,
  json: (obj: any) => any,
  end: () => any
} = {
  statusCode: null,
  jsonMessage: null,
  status (statusCode: number) {
    this.statusCode = statusCode
    return this
  },
  json: function (obj: any) {
    this.jsonMessage = obj
    return this
  },
  end () {
    return this
  }
}
export const next = function () {
  return true
}