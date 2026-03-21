export const REQUEST_ID_QUERY_PARAM = 'requestId';

export const buildRequestSuccessPath = (
  basePath: string,
  requestId: string,
) => {
  const searchParams = new URLSearchParams({
    [REQUEST_ID_QUERY_PARAM]: requestId,
  });

  return `${basePath}?${searchParams.toString()}`;
};

export const getRequestIdFromSearchParams = (searchParams: URLSearchParams) =>
  searchParams.get(REQUEST_ID_QUERY_PARAM);

export const getRequestIdFromLocationSearch = (search: string) =>
  getRequestIdFromSearchParams(new URLSearchParams(search));
