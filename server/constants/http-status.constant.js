/**
 * HTTP status codes commonly used in RESTful APIs.
 * Each constant is documented to improve readability and developer understanding.
 *
 * @readonly
 * @enum {number}
 */
const HTTP_STATUS = {
    /**
     * 200 OK – Standard response for successful HTTP requests.
     */
    OK: 200,

    /**
     * 201 Created – Request has succeeded and a new resource has been created.
     */
    CREATED: 201,

    /**
     * 202 Accepted – Request has been accepted for processing, but not completed yet.
     */
    ACCEPTED: 202,

    /**
     * 204 No Content – Request succeeded, but no content is returned in response.
     */
    NO_CONTENT: 204,

    /**
     * 301 Moved Permanently – The resource has permanently moved to a new URL.
     */
    MOVED_PERMANENTLY: 301,

    /**
     * 302 Found – The resource resides temporarily under a different URI.
     */
    FOUND: 302,

    /**
     * 304 Not Modified – The resource has not been modified since the last request.
     */
    NOT_MODIFIED: 304,

    /**
     * 400 Bad Request – The server could not understand the request due to invalid syntax.
     */
    BAD_REQUEST: 400,

    /**
     * 401 Unauthorized – Authentication is required and has failed or has not been provided.
     */
    UNAUTHORIZED: 401,

    /**
     * 403 Forbidden – The client does not have permission to access the resource.
     */
    FORBIDDEN: 403,

    /**
     * 404 Not Found – The requested resource could not be found on the server.
     */
    NOT_FOUND: 404,

    /**
     * 409 Conflict – The request could not be completed due to a conflict with the current state of the resource.
     */
    CONFLICT: 409,

    /**
     * 422 Unprocessable Entity – The server understands the content type but was unable to process the contained instructions.
     */
    UNPROCESSABLE_ENTITY: 422,

    /**
     * 429 Too Many Requests – The user has sent too many requests in a given amount of time ("rate limiting").
     */
    TOO_MANY_REQUESTS: 429,

    /**
     * 500 Internal Server Error – A generic error message for unexpected server conditions.
     */
    INTERNAL_SERVER_ERROR: 500,

    /**
     * 501 Not Implemented – The server does not support the functionality required to fulfill the request.
     */
    NOT_IMPLEMENTED: 501,

    /**
     * 502 Bad Gateway – The server received an invalid response from the upstream server.
     */
    BAD_GATEWAY: 502,

    /**
     * 503 Service Unavailable – The server is currently unavailable (overloaded or down for maintenance).
     */
    SERVICE_UNAVAILABLE: 503,

    /**
     * 504 Gateway Timeout – The server did not receive a timely response from the upstream server.
     */
    GATEWAY_TIMEOUT: 504,
};

module.exports = HTTP_STATUS;
