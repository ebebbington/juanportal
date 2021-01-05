export const req: any = {
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
export const res:any = {
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