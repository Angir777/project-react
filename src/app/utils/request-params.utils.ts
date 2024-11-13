/* eslint-disable @typescript-eslint/no-explicit-any */
export const prepareRequestParams = (params: any) => {
  // eslint-disable-next-line prefer-const
  let p: any = {};

  if (params) {
    Object.keys(params).map((key) => {
      if (params[key] === null || params[key].toString().length < 1) {
        // 
      } else {
        p[key] = params[key];
      }

      return key;
    });
  }

  return p;
};

export const prepareFilters = (filters: any) => {
  // eslint-disable-next-line prefer-const
  let f: any = {};

  if (filters && filters.length > 0) {
    filters.map((filter: any) => {
      const key = `filter[${filter.id}]`;
      f[key] = filter.value;

      return filter;
    });
  }

  return f;
};
