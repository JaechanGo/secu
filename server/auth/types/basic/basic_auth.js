"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicAuthentication = void 0;

var _routes = require("./routes");

var _authentication_type = require("../authentication_type");

var _common = require("../../../../common");

var _next_url = require("../../../utils/next_url");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BasicAuthentication extends _authentication_type.AuthenticationType {
  constructor(config, sessionStorageFactory, router, esClient, coreSetup, logger) {
    super(config, sessionStorageFactory, router, esClient, coreSetup, logger);

    _defineProperty(this, "type", 'basicauth');

    this.init();
  }

  async init() {
    const routes = new _routes.BasicAuthRoutes(this.router, this.config, this.sessionStorageFactory, this.securityClient, this.coreSetup);
    routes.setupRoutes();
  } // override functions inherited from AuthenticationType


  requestIncludesAuthInfo(request) {
    return request.headers[BasicAuthentication.AUTH_HEADER_NAME] ? true : false;
  }

  getAdditionalAuthHeader(request) {
    return {};
  }

  getCookie(request, authInfo) {
    if (this.config.auth.anonymous_auth_enabled && authInfo.user_name === 'opendistro_security_anonymous') {
      return {
        username: authInfo.user_name,
        authType: this.type,
        expiryTime: Date.now() + this.config.session.ttl,
        isAnonymousAuth: true
      };
    }

    return {
      username: authInfo.user_name,
      credentials: {
        authHeaderValue: request.headers[BasicAuthentication.AUTH_HEADER_NAME]
      },
      authType: this.type,
      expiryTime: Date.now() + this.config.session.ttl
    };
  }

  async isValidCookie(cookie) {
    var _cookie$credentials;

    return cookie.authType === this.type && cookie.expiryTime && (cookie.username && ((_cookie$credentials = cookie.credentials) === null || _cookie$credentials === void 0 ? void 0 : _cookie$credentials.authHeaderValue) || this.config.auth.anonymous_auth_enabled && cookie.isAnonymousAuth);
  }

  handleUnauthedRequest(request, response, toolkit) {
    if (this.isPageRequest(request)) {
      const nextUrlParam = (0, _next_url.composeNextUrlQeuryParam)(request, this.coreSetup.http.basePath.serverBasePath);
      const redirectLocation = `${this.coreSetup.http.basePath.serverBasePath}${_common.LOGIN_PAGE_URI}?${nextUrlParam}`;
      return response.redirected({
        headers: {
          location: `${redirectLocation}`
        }
      });
    } else {
      return response.unauthorized({
        body: `Authentication required`
      });
    }
  }

  buildAuthHeaderFromCookie(cookie) {
    var _cookie$credentials2;

    if (this.config.auth.anonymous_auth_enabled && cookie.isAnonymousAuth) {
      return {};
    }

    const headers = {};
    Object.assign(headers, {
      authorization: (_cookie$credentials2 = cookie.credentials) === null || _cookie$credentials2 === void 0 ? void 0 : _cookie$credentials2.authHeaderValue
    });
    return headers;
  }

}

exports.BasicAuthentication = BasicAuthentication;

_defineProperty(BasicAuthentication, "AUTH_HEADER_NAME", 'authorization');
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2ljX2F1dGgudHMiXSwibmFtZXMiOlsiQmFzaWNBdXRoZW50aWNhdGlvbiIsIkF1dGhlbnRpY2F0aW9uVHlwZSIsImNvbnN0cnVjdG9yIiwiY29uZmlnIiwic2Vzc2lvblN0b3JhZ2VGYWN0b3J5Iiwicm91dGVyIiwiZXNDbGllbnQiLCJjb3JlU2V0dXAiLCJsb2dnZXIiLCJpbml0Iiwicm91dGVzIiwiQmFzaWNBdXRoUm91dGVzIiwic2VjdXJpdHlDbGllbnQiLCJzZXR1cFJvdXRlcyIsInJlcXVlc3RJbmNsdWRlc0F1dGhJbmZvIiwicmVxdWVzdCIsImhlYWRlcnMiLCJBVVRIX0hFQURFUl9OQU1FIiwiZ2V0QWRkaXRpb25hbEF1dGhIZWFkZXIiLCJnZXRDb29raWUiLCJhdXRoSW5mbyIsImF1dGgiLCJhbm9ueW1vdXNfYXV0aF9lbmFibGVkIiwidXNlcl9uYW1lIiwidXNlcm5hbWUiLCJhdXRoVHlwZSIsInR5cGUiLCJleHBpcnlUaW1lIiwiRGF0ZSIsIm5vdyIsInNlc3Npb24iLCJ0dGwiLCJpc0Fub255bW91c0F1dGgiLCJjcmVkZW50aWFscyIsImF1dGhIZWFkZXJWYWx1ZSIsImlzVmFsaWRDb29raWUiLCJjb29raWUiLCJoYW5kbGVVbmF1dGhlZFJlcXVlc3QiLCJyZXNwb25zZSIsInRvb2xraXQiLCJpc1BhZ2VSZXF1ZXN0IiwibmV4dFVybFBhcmFtIiwiaHR0cCIsImJhc2VQYXRoIiwic2VydmVyQmFzZVBhdGgiLCJyZWRpcmVjdExvY2F0aW9uIiwiTE9HSU5fUEFHRV9VUkkiLCJyZWRpcmVjdGVkIiwibG9jYXRpb24iLCJ1bmF1dGhvcml6ZWQiLCJib2R5IiwiYnVpbGRBdXRoSGVhZGVyRnJvbUNvb2tpZSIsIk9iamVjdCIsImFzc2lnbiIsImF1dGhvcml6YXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUE0QkE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFFTyxNQUFNQSxtQkFBTixTQUFrQ0MsdUNBQWxDLENBQXFEO0FBSTFEQyxFQUFB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QixRQUFBQSxPQUFPLEVBQUU7QUFDUGdDLFVBQUFBLFFBQVEsRUFBRyxHQUFFSCxnQkFBaUI7QUFEdkI7QUFEZ0IsT0FBcEIsQ0FBUDtBQUtELEtBWEQsTUFXTztBQUNMLGFBQU9QLFFBQVEsQ0FBQ1csWUFBVCxDQUFzQjtBQUMzQkMsUUFBQUEsSUFBSSxFQUFHO0FBRG9CLE9BQXRCLENBQVA7QUFHRDtBQUNGOztBQUVEQyxFQUFBQSx5QkFBeUIsQ0FBQ2YsTUFBRCxFQUFxQztBQUFBOztBQUM1RCxRQUFJLEtBQUtqQyxNQUFMLENBQVlrQixJQUFaLENBQWlCQyxzQkFBakIsSUFBMkNjLE1BQU0sQ0FBQ0osZUFBdEQsRUFBdUU7QUFDckUsYUFBTyxFQUFQO0FBQ0Q7O0FBQ0QsVUFBTWhCLE9BQVksR0FBRyxFQUFyQjtBQUNBb0MsSUFBQUEsTUFBTSxDQUFDQyxNQUFQLENBQWNyQyxPQUFkLEVBQXVCO0FBQUVzQyxNQUFBQSxhQUFhLDBCQUFFbEIsTUFBTSxDQUFDSCxXQUFULHlEQUFFLHFCQUFvQkM7QUFBckMsS0FBdkI7QUFDQSxXQUFPbEIsT0FBUDtBQUNEOztBQWxHeUQ7Ozs7Z0JBQS9DaEIsbUIsc0JBQ3dDLGUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogICBDb3B5cmlnaHQgMjAyMCBBbWF6b24uY29tLCBJbmMuIG9yIGl0cyBhZmZpbGlhdGVzLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqICAgTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKS5cbiAqICAgWW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogICBBIGNvcHkgb2YgdGhlIExpY2Vuc2UgaXMgbG9jYXRlZCBhdFxuICpcbiAqICAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqICAgb3IgaW4gdGhlIFwibGljZW5zZVwiIGZpbGUgYWNjb21wYW55aW5nIHRoaXMgZmlsZS4gVGhpcyBmaWxlIGlzIGRpc3RyaWJ1dGVkXG4gKiAgIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlclxuICogICBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZ1xuICogICBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtcbiAgQ29yZVNldHVwLFxuICBTZXNzaW9uU3RvcmFnZUZhY3RvcnksXG4gIElSb3V0ZXIsXG4gIElMZWdhY3lDbHVzdGVyQ2xpZW50LFxuICBLaWJhbmFSZXF1ZXN0LFxuICBMb2dnZXIsXG4gIExpZmVjeWNsZVJlc3BvbnNlRmFjdG9yeSxcbiAgQXV0aFRvb2xraXQsXG59IGZyb20gJ2tpYmFuYS9zZXJ2ZXInO1xuaW1wb3J0IHsgS2liYW5hUmVzcG9uc2UgfSBmcm9tICdzcmMvY29yZS9zZXJ2ZXIvaHR0cC9yb3V0ZXInO1xuaW1wb3J0IHsgU2VjdXJpdHlQbHVnaW5Db25maWdUeXBlIH0gZnJvbSAnLi4vLi4vLi4nO1xuaW1wb3J0IHsgU2VjdXJpdHlTZXNzaW9uQ29va2llIH0gZnJvbSAnLi4vLi4vLi4vc2Vzc2lvbi9zZWN1cml0eV9jb29raWUnO1xuaW1wb3J0IHsgQmFzaWNBdXRoUm91dGVzIH0gZnJvbSAnLi9yb3V0ZXMnO1xuaW1wb3J0IHsgQXV0aGVudGljYXRpb25UeXBlIH0gZnJvbSAnLi4vYXV0aGVudGljYXRpb25fdHlwZSc7XG5pbXBvcnQgeyBMT0dJTl9QQUdFX1VSSSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvbW1vbic7XG5pbXBvcnQgeyBjb21wb3NlTmV4dFVybFFldXJ5UGFyYW0gfSBmcm9tICcuLi8uLi8uLi91dGlscy9uZXh0X3VybCc7XG5cbmV4cG9ydCBjbGFzcyBCYXNpY0F1dGhlbnRpY2F0aW9uIGV4dGVuZHMgQXV0aGVudGljYXRpb25UeXBlIHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQVVUSF9IRUFERVJfTkFNRTogc3RyaW5nID0gJ2F1dGhvcml6YXRpb24nO1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZTogc3RyaW5nID0gJ2Jhc2ljYXV0aCc7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY29uZmlnOiBTZWN1cml0eVBsdWdpbkNvbmZpZ1R5cGUsXG4gICAgc2Vzc2lvblN0b3JhZ2VGYWN0b3J5OiBTZXNzaW9uU3RvcmFnZUZhY3Rvcnk8U2VjdXJpdHlTZXNzaW9uQ29va2llPixcbiAgICByb3V0ZXI6IElSb3V0ZXIsXG4gICAgZXNDbGllbnQ6IElMZWdhY3lDbHVzdGVyQ2xpZW50LFxuICAgIGNvcmVTZXR1cDogQ29yZVNldHVwLFxuICAgIGxvZ2dlcjogTG9nZ2VyXG4gICkge1xuICAgIHN1cGVyKGNvbmZpZywgc2Vzc2lvblN0b3JhZ2VGYWN0b3J5LCByb3V0ZXIsIGVzQ2xpZW50LCBjb3JlU2V0dXAsIGxvZ2dlcik7XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaW5pdCgpIHtcbiAgICBjb25zdCByb3V0ZXMgPSBuZXcgQmFzaWNBdXRoUm91dGVzKFxuICAgICAgdGhpcy5yb3V0ZXIsXG4gICAgICB0aGlzLmNvbmZpZyxcbiAgICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2VGYWN0b3J5LFxuICAgICAgdGhpcy5zZWN1cml0eUNsaWVudCxcbiAgICAgIHRoaXMuY29yZVNldHVwXG4gICAgKTtcbiAgICByb3V0ZXMuc2V0dXBSb3V0ZXMoKTtcbiAgfVxuXG4gIC8vIG92ZXJyaWRlIGZ1bmN0aW9ucyBpbmhlcml0ZWQgZnJvbSBBdXRoZW50aWNhdGlvblR5cGVcbiAgcmVxdWVzdEluY2x1ZGVzQXV0aEluZm8ocmVxdWVzdDogS2liYW5hUmVxdWVzdDx1bmtub3duLCB1bmtub3duLCB1bmtub3duLCBhbnk+KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHJlcXVlc3QuaGVhZGVyc1tCYXNpY0F1dGhlbnRpY2F0aW9uLkFVVEhfSEVBREVSX05BTUVdID8gdHJ1ZSA6IGZhbHNlO1xuICB9XG5cbiAgZ2V0QWRkaXRpb25hbEF1dGhIZWFkZXIocmVxdWVzdDogS2liYW5hUmVxdWVzdDx1bmtub3duLCB1bmtub3duLCB1bmtub3duLCBhbnk+KSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgZ2V0Q29va2llKHJlcXVlc3Q6IEtpYmFuYVJlcXVlc3QsIGF1dGhJbmZvOiBhbnkpOiBTZWN1cml0eVNlc3Npb25Db29raWUge1xuICAgIGlmIChcbiAgICAgIHRoaXMuY29uZmlnLmF1dGguYW5vbnltb3VzX2F1dGhfZW5hYmxlZCAmJlxuICAgICAgYXV0aEluZm8udXNlcl9uYW1lID09PSAnb3BlbmRpc3Ryb19zZWN1cml0eV9hbm9ueW1vdXMnXG4gICAgKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB1c2VybmFtZTogYXV0aEluZm8udXNlcl9uYW1lLFxuICAgICAgICBhdXRoVHlwZTogdGhpcy50eXBlLFxuICAgICAgICBleHBpcnlUaW1lOiBEYXRlLm5vdygpICsgdGhpcy5jb25maWcuc2Vzc2lvbi50dGwsXG4gICAgICAgIGlzQW5vbnltb3VzQXV0aDogdHJ1ZSxcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB1c2VybmFtZTogYXV0aEluZm8udXNlcl9uYW1lLFxuICAgICAgY3JlZGVudGlhbHM6IHtcbiAgICAgICAgYXV0aEhlYWRlclZhbHVlOiByZXF1ZXN0LmhlYWRlcnNbQmFzaWNBdXRoZW50aWNhdGlvbi5BVVRIX0hFQURFUl9OQU1FXSxcbiAgICAgIH0sXG4gICAgICBhdXRoVHlwZTogdGhpcy50eXBlLFxuICAgICAgZXhwaXJ5VGltZTogRGF0ZS5ub3coKSArIHRoaXMuY29uZmlnLnNlc3Npb24udHRsLFxuICAgIH07XG4gIH1cblxuICBhc3luYyBpc1ZhbGlkQ29va2llKGNvb2tpZTogU2VjdXJpdHlTZXNzaW9uQ29va2llKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIChcbiAgICAgIGNvb2tpZS5hdXRoVHlwZSA9PT0gdGhpcy50eXBlICYmXG4gICAgICBjb29raWUuZXhwaXJ5VGltZSAmJlxuICAgICAgKChjb29raWUudXNlcm5hbWUgJiYgY29va2llLmNyZWRlbnRpYWxzPy5hdXRoSGVhZGVyVmFsdWUpIHx8XG4gICAgICAgICh0aGlzLmNvbmZpZy5hdXRoLmFub255bW91c19hdXRoX2VuYWJsZWQgJiYgY29va2llLmlzQW5vbnltb3VzQXV0aCkpXG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZVVuYXV0aGVkUmVxdWVzdChcbiAgICByZXF1ZXN0OiBLaWJhbmFSZXF1ZXN0LFxuICAgIHJlc3BvbnNlOiBMaWZlY3ljbGVSZXNwb25zZUZhY3RvcnksXG4gICAgdG9vbGtpdDogQXV0aFRvb2xraXRcbiAgKTogS2liYW5hUmVzcG9uc2Uge1xuICAgIGlmICh0aGlzLmlzUGFnZVJlcXVlc3QocmVxdWVzdCkpIHtcbiAgICAgIGNvbnN0IG5leHRVcmxQYXJhbSA9IGNvbXBvc2VOZXh0VXJsUWV1cnlQYXJhbShcbiAgICAgICAgcmVxdWVzdCxcbiAgICAgICAgdGhpcy5jb3JlU2V0dXAuaHR0cC5iYXNlUGF0aC5zZXJ2ZXJCYXNlUGF0aFxuICAgICAgKTtcbiAgICAgIGNvbnN0IHJlZGlyZWN0TG9jYXRpb24gPSBgJHt0aGlzLmNvcmVTZXR1cC5odHRwLmJhc2VQYXRoLnNlcnZlckJhc2VQYXRofSR7TE9HSU5fUEFHRV9VUkl9PyR7bmV4dFVybFBhcmFtfWA7XG4gICAgICByZXR1cm4gcmVzcG9uc2UucmVkaXJlY3RlZCh7XG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBsb2NhdGlvbjogYCR7cmVkaXJlY3RMb2NhdGlvbn1gLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXNwb25zZS51bmF1dGhvcml6ZWQoe1xuICAgICAgICBib2R5OiBgQXV0aGVudGljYXRpb24gcmVxdWlyZWRgLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYnVpbGRBdXRoSGVhZGVyRnJvbUNvb2tpZShjb29raWU6IFNlY3VyaXR5U2Vzc2lvbkNvb2tpZSk6IGFueSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLmF1dGguYW5vbnltb3VzX2F1dGhfZW5hYmxlZCAmJiBjb29raWUuaXNBbm9ueW1vdXNBdXRoKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnN0IGhlYWRlcnM6IGFueSA9IHt9O1xuICAgIE9iamVjdC5hc3NpZ24oaGVhZGVycywgeyBhdXRob3JpemF0aW9uOiBjb29raWUuY3JlZGVudGlhbHM/LmF1dGhIZWFkZXJWYWx1ZSB9KTtcbiAgICByZXR1cm4gaGVhZGVycztcbiAgfVxufVxuIl19