/**
 * 1xx Informational
 *
 * Request received, continuing process.
 * This class of status code indicates a provisional response,
 * consisting only of the Status-Line and optional headers,
 * and is terminated by an empty line.
 * Since HTTP/1.0 did not define any 1xx status codes,
 * servers must not send a 1xx response to an HTTP/1.0 client
 * except under experimental conditions.
 */

export enum INFORMATIONAL_CODES {
    CONTINUE = 100,
    SWITCHING_PROTOCOLS = 101,
    PROCESSING = 102,
    EARLY_HINTS = 103,
}

/**
 * 2xx
 *
 * This class of status codes indicates the action requested by the client was received, understood, accepted, and processed successfully.
 */

export enum SUCCESS_CODES {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NON_AUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    MULTI_STATUS = 207,
    ALREADY_REPORTED = 208,
    IM_USED = 226,
}

/**
 * 3xx
 *
 * This class of status code indicates the client must take additional action to complete the request. Many of these status codes are used in URL redirection. A user agent may carry out the additional action with no user interaction only if the method used in the second request is GET or HEAD. A user agent may automatically redirect a request. A user agent should detect and intervene to prevent cyclical redirects.
 */

export enum REDIRECT_CODES {
    MULTIPLE_CHOICES = 300,
    MOVED_PERMANENTLY = 301,
    FOUND_PREVIOUSLY_MOVED_TEMPORARILY = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    USE_PROXY = 305,
    SWITCH_PROXY = 306,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
}

/**
 * 4xx
 *
 * The 4xx class of status code is intended for situations in which the client seems to have erred. Except when responding to a HEAD request, the server should include an entity containing an explanation of the error situation, and whether it is a temporary or permanent condition. These status codes are applicable to any request method. User agents should display any included entity to the user.
 */

export enum CLIENT_ERROR_CODES {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    IM_A_TEAPOT = 418,
    MISDIRECTED_REQUEST = 421,
    UNPROCESSABLE_ENTITY = 422,
    LOCKED = 423,
    FAILED_DEPENDENCY = 424,
    TOO_EARLY = 425,
    UPGRADE_REQUIRED = 426,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
    UNAVAILABLE_FOR_LEGAL_REASONS = 451,
}

/**
 * 5xx
 *
 * The server failed to fulfill an apparently valid request. Response status codes beginning with the digit 5 indicate cases in which the server is aware that it has encountered an error or is otherwise incapable of performing the request. Except when responding to a HEAD request, the server should include an entity containing an explanation of the error situation, and indicate whether it is a temporary or permanent condition. Likewise, user agents should display any included entity to the user. These response codes are applicable to any request method.
 */

export enum INTERNAL_SERVER_ERROR_CODES {
    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
    HTTP_VERSION_NOT_SUPPORTED = 505,
    VARIANT_ALSO_NEGOTIATES = 506,
    INSUFFICIENT_STORAGE = 507,
    LOOP_DETECTED = 508,
    NOT_EXTENDED = 510,
    NETWORK_AUTHENTICATION_REQUIRED = 511,
}

export type TStatusCodes =
    | INFORMATIONAL_CODES
    | SUCCESS_CODES
    | REDIRECT_CODES
    | CLIENT_ERROR_CODES
    | INTERNAL_SERVER_ERROR_CODES;

export const STATUS_CODES_MESSAGES_MAP: Record<TStatusCodes, string> = {
    /**
     * 100
     *
     * This interim response indicates that the client should continue the request or ignore the response if the request is already finished.
     */
    [INFORMATIONAL_CODES.CONTINUE]: 'Continue',
    /**
     * 101
     *
     * This code is sent in response to an Upgrade request header from the client and indicates the protocol the server is switching to.
     */
    [INFORMATIONAL_CODES.SWITCHING_PROTOCOLS]: 'Switching protocols',
    /**
     * 102
     *
     * This code indicates that the server has received and is processing the request, but no response is available yet.
     */
    [INFORMATIONAL_CODES.PROCESSING]: 'Processing',
    /**
     * 103
     *
     * This status code is primarily intended to be used with the Link header, letting the user agent start preloading resources while the server prepares a response.
     */
    [INFORMATIONAL_CODES.EARLY_HINTS]: 'Early Hints',
    /**
     * 200
     *
     * The request succeeded. The result meaning of "success" depends on the HTTP method:
     *
     * GET: The resource has been fetched and transmitted in the message body.
     * HEAD: The representation headers are included in the response without any message body.
     * PUT or POST: The resource describing the result of the action is transmitted in the message body.
     * TRACE: The message body contains the request message as received by the server.
     */
    [SUCCESS_CODES.OK]: 'OK',
    /**
     * 201
     *
     * The request succeeded, and a new resource was created as a result. This is typically the response sent after POST requests, or some PUT requests.
     */
    [SUCCESS_CODES.CREATED]: 'Created',
    /**
     * 202
     *
     * The request has been received but not yet acted upon. It is noncommittal, since there is no way in HTTP to later send an asynchronous response indicating the outcome of the request. It is intended for cases where another process or server handles the request, or for batch processing.
     */
    [SUCCESS_CODES.ACCEPTED]: 'Accepted',
    /**
     * 203
     *
     * This response code means the returned metadata is not exactly the same as is available from the origin server, but is collected from a local or a third-party copy. This is mostly used for mirrors or backups of another resource. Except for that specific case, the 200 OK response is preferred to this status.
     */
    [SUCCESS_CODES.NON_AUTHORITATIVE_INFORMATION]:
        'Non-Authoritative Information',
    /**
     * 204
     *
     * There is no content to send for this request, but the headers may be useful. The user agent may update its cached headers for this resource with the new ones.
     */
    [SUCCESS_CODES.NO_CONTENT]: 'No Content',
    /**
     * 205
     *
     * Tells the user agent to reset the document which sent this request.
     */
    [SUCCESS_CODES.RESET_CONTENT]: 'Reset Content',
    /**
     * 206
     *
     * This response code is used when the Range header is sent from the client to request only part of a resource.
     */
    [SUCCESS_CODES.PARTIAL_CONTENT]: 'Partial Content',
    /**
     * 207
     *
     * Conveys information about multiple resources, for situations where multiple status codes might be appropriate.
     */
    [SUCCESS_CODES.MULTI_STATUS]: 'Multi-Status',
    /**
     * 208
     *
     * Used inside a <dav:propstat> response element to avoid repeatedly enumerating the internal members of multiple bindings to the same collection.
     */
    [SUCCESS_CODES.ALREADY_REPORTED]: 'Already Reported',
    /**
     * 226
     *
     * The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.
     */
    [SUCCESS_CODES.IM_USED]: 'IM Used',
    /**
     * 300
     *
     * The request has more than one possible response. The user agent or user should choose one of them. (There is no standardized way of choosing one of the responses, but HTML links to the possibilities are recommended so the user can pick.)
     */
    [REDIRECT_CODES.MULTIPLE_CHOICES]: 'Multiple Choices',
    /**
     * 301
     *
     * The URL of the requested resource has been changed permanently. The new URL is given in the response.
     */
    [REDIRECT_CODES.MOVED_PERMANENTLY]: 'Moved Permanently',
    /**
     * 302
     *
     * This response code means that the URI of requested resource has been changed temporarily. Further changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
     */
    [REDIRECT_CODES.FOUND_PREVIOUSLY_MOVED_TEMPORARILY]:
        'Found (Previously "Moved Temporarily")',
    /**
     * 303
     *
     * The server sent this response to direct the client to get the requested resource at another URI with a GET request.
     */
    [REDIRECT_CODES.SEE_OTHER]: 'See Other',
    /**
     * 304
     *
     * This is used for caching purposes. It tells the client that the response has not been modified, so the client can continue to use the same cached version of the response.
     */
    [REDIRECT_CODES.NOT_MODIFIED]: 'Not Modified',
    /**
     * 305
     *
     * Defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
     */
    [REDIRECT_CODES.USE_PROXY]: 'Use Proxy',
    /**
     * 306 UNUSED
     *
     * This response code is no longer used; it is just reserved. It was used in a previous version of the HTTP/1.1 specification.
     */
    [REDIRECT_CODES.SWITCH_PROXY]: 'Switch Proxy',
    /**
     * 307
     *
     * The server sends this response to direct the client to get the requested resource at another URI with the same method that was used in the prior request. This has the same semantics as the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    [REDIRECT_CODES.TEMPORARY_REDIRECT]: 'Temporary Redirect',
    /**
     * 308
     *
     * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     */
    [REDIRECT_CODES.PERMANENT_REDIRECT]: 'Permanent Redirect',
    /**
     * 400
     *
     * The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
     */
    [CLIENT_ERROR_CODES.BAD_REQUEST]: 'Bad Request',
    /**
     * 401
     *
     * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
     */
    [CLIENT_ERROR_CODES.UNAUTHORIZED]: 'Unauthorized',
    /**
     * 402
     *
     * This response code is reserved for future use. The initial aim for creating this code was using it for digital payment systems, however this status code is used very rarely and no standard convention exists.
     */
    [CLIENT_ERROR_CODES.PAYMENT_REQUIRED]: 'Payment Required',
    /**
     * 403
     *
     * The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.
     */
    [CLIENT_ERROR_CODES.FORBIDDEN]: 'Forbidden',
    /**
     * 404
     *
     * The server cannot find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 Forbidden to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.
     */
    [CLIENT_ERROR_CODES.NOT_FOUND]: 'Not Found',
    /**
     * 405
     *
     * The request method is known by the server but is not supported by the target resource. For example, an API may not allow calling DELETE to remove a resource.
     */
    [CLIENT_ERROR_CODES.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
    /**
     * 406
     *
     * This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.
     */
    [CLIENT_ERROR_CODES.NOT_ACCEPTABLE]: 'Not Acceptable',
    /**
     * 407
     *
     * This is similar to 401 Unauthorized but authentication is needed to be done by a proxy.
     */
    [CLIENT_ERROR_CODES.PROXY_AUTHENTICATION_REQUIRED]:
        'Proxy Authentication Required',
    /**
     * 408
     *
     * This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
     */
    [CLIENT_ERROR_CODES.REQUEST_TIMEOUT]: 'Request Timeout',
    /**
     * 409
     *
     * This response is sent when a request conflicts with the current state of the server.
     */
    [CLIENT_ERROR_CODES.CONFLICT]: 'Conflict',
    /**
     * 410
     *
     * This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
     */
    [CLIENT_ERROR_CODES.GONE]: 'Gone',
    /**
     * 411
     *
     * Server rejected the request because the Content-Length header field is not defined and the server requires it.
     */
    [CLIENT_ERROR_CODES.LENGTH_REQUIRED]: 'Length Required',
    /**
     * 412
     *
     * The client has indicated preconditions in its headers which the server does not meet.
     */
    [CLIENT_ERROR_CODES.PRECONDITION_FAILED]: 'Precondition Failed',
    /**
     * 413
     *
     * Request entity is larger than limits defined by server. The server might close the connection or return a Retry-After header field.
     */
    [CLIENT_ERROR_CODES.PAYLOAD_TOO_LARGE]: 'Payload Too Large',
    /**
     * 414
     *
     * The URI requested by the client is longer than the server is willing to interpret.
     */
    [CLIENT_ERROR_CODES.URI_TOO_LONG]: 'URI Too Long',
    /**
     * 415
     *
     * The media format of the requested data is not supported by the server, so the server is rejecting the request.
     */
    [CLIENT_ERROR_CODES.UNSUPPORTED_MEDIA_TYPE]: 'Unsupported Media Type',
    /**
     * 416
     *
     * The range specified by the Range header field in the request cannot be fulfilled. It's possible that the range is outside the size of the target URI's data.
     */
    [CLIENT_ERROR_CODES.RANGE_NOT_SATISFIABLE]: 'Range Not Satisfiable',
    /**
     * 416
     *
     * This response code means the expectation indicated by the Expect request header field cannot be met by the server.
     */
    [CLIENT_ERROR_CODES.EXPECTATION_FAILED]: 'Expectation Failed',
    /**
     * 418
     *
     * The server refuses the attempt to brew coffee with a teapot.
     */
    [CLIENT_ERROR_CODES.IM_A_TEAPOT]: 'I"m a Teapot',
    /**
     * 421
     *
     * The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.
     */
    [CLIENT_ERROR_CODES.MISDIRECTED_REQUEST]: 'Misdirected Request',
    /**
     * 422
     *
     * The request was well-formed but was unable to be followed due to semantic errors.
     */
    [CLIENT_ERROR_CODES.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
    /**
     * 423
     *
     * The resource that is being accessed is locked.
     */
    [CLIENT_ERROR_CODES.LOCKED]: 'Locked',
    /**
     * 424
     *
     * The request failed due to failure of a previous request.
     */
    [CLIENT_ERROR_CODES.FAILED_DEPENDENCY]: 'Failed Dependency',
    /**
     * 425
     *
     * Indicates that the server is unwilling to risk processing a request that might be replayed.
     */
    [CLIENT_ERROR_CODES.TOO_EARLY]: 'Too Early',
    /**
     * 426
     *
     * The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s).
     */
    [CLIENT_ERROR_CODES.UPGRADE_REQUIRED]: 'Upgrade Required',
    /**
     * 428
     *
     * The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
     */
    [CLIENT_ERROR_CODES.PRECONDITION_REQUIRED]: 'Precondition Required',
    /**
     * 429
     *
     * The user has sent too many requests in a given amount of time ("rate limiting").
     */
    [CLIENT_ERROR_CODES.TOO_MANY_REQUESTS]: 'Too Many Requests',
    /**
     * 431
     *
     * The server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields.
     */
    [CLIENT_ERROR_CODES.REQUEST_HEADER_FIELDS_TOO_LARGE]:
        'Request Header Fields Too Large',
    /**
     * 451
     *
     * The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.
     */
    [CLIENT_ERROR_CODES.UNAVAILABLE_FOR_LEGAL_REASONS]:
        'Unavailable For Legal Reasons',
    /**
     * 500
     *
     * The server has encountered a situation it does not know how to handle.
     */
    [INTERNAL_SERVER_ERROR_CODES.INTERNAL_SERVER_ERROR]:
        'Internal Server Error',
    /**
     * 501
     *
     * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
     */
    [INTERNAL_SERVER_ERROR_CODES.NOT_IMPLEMENTED]: 'Not Implemented',
    /**
     * 502
     *
     * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
     */
    [INTERNAL_SERVER_ERROR_CODES.BAD_GATEWAY]: 'Bad Gateway',
    /**
     * 503
     *
     * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
     */
    [INTERNAL_SERVER_ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service Unavailable',
    /**
     * 504
     *
     * This error response is given when the server is acting as a gateway and cannot get a response in time.
     */
    [INTERNAL_SERVER_ERROR_CODES.GATEWAY_TIMEOUT]: 'Gateway Timeout',
    /**
     * 505
     *
     * The HTTP version used in the request is not supported by the server.
     */
    [INTERNAL_SERVER_ERROR_CODES.HTTP_VERSION_NOT_SUPPORTED]:
        'HTTP Version Not Supported',
    /**
     * 506
     *
     * The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
     */
    [INTERNAL_SERVER_ERROR_CODES.VARIANT_ALSO_NEGOTIATES]:
        'Variant Also Negotiates',
    /**
     * 507
     *
     * The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.
     */
    [INTERNAL_SERVER_ERROR_CODES.INSUFFICIENT_STORAGE]: 'Insufficient Storage',
    /**
     * 508
     *
     * The server detected an infinite loop while processing the request.
     */
    [INTERNAL_SERVER_ERROR_CODES.LOOP_DETECTED]: 'Loop Detected',
    /**
     * 510
     *
     * Further extensions to the request are required for the server to fulfill it.
     */
    [INTERNAL_SERVER_ERROR_CODES.NOT_EXTENDED]: 'Not Extended',
    /**
     * 511
     *
     * Indicates that the client needs to authenticate to gain network access.
     */
    [INTERNAL_SERVER_ERROR_CODES.NETWORK_AUTHENTICATION_REQUIRED]:
        'Network Authentication Required',
};
