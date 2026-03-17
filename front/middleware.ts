import { NextResponse, type NextRequest } from "next/server";
import { refreshAccessToken, verifySession } from "./server";
import { CookiesEnum, RouteEnum, UserRoleEnum } from "./enums";
import { getFiveMinutes } from "./lib/dates";

const PUBLIC_ROUTES = [
  RouteEnum.LOGIN,
  RouteEnum.REGISTER,
  RouteEnum.CREATE_PASSWORD,
  RouteEnum.FORGOT_PASSWORD,
  RouteEnum.PRIVACY_POLICY,
  RouteEnum.TERMS_OF_USE,
  RouteEnum.PUBLIC_ATHLETE,
  RouteEnum.UNSUBSCRIBE,
] as string[];

const COLLABORATOR_ROUTES = [RouteEnum.AUTHENTICATED] as string[];

interface MiddlewareRequest extends NextRequest {
  user: { id: string; name: string; email: string; type: UserRoleEnum };
}

export async function middleware(request: MiddlewareRequest) {
  const session = await verifySession();
  const nextUrl = request.nextUrl;

  const pathname = nextUrl.pathname;
  const firstSegment = "/".concat(pathname.split("/")[1]);

  console.log("AUTHENTICATED", RouteEnum.AUTHENTICATED);
  console.log("pathname", nextUrl.pathname);

  const isPublicRoute = PUBLIC_ROUTES.includes(firstSegment);

  console.log({
    pathname: nextUrl.pathname,
    isPublicRoute,
    access: !!session.access,
    hasUser: !!session.user,
    userType: session.user?.type,
  });

  const isCollaboratorRoute = COLLABORATOR_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const response = NextResponse.next();
  buildHeaderWithUrl(request, response);

  if (isPublicRoute) {
    if (session.access && session.user) {
      if (pathname !== RouteEnum.AUTHENTICATED) {
        return NextResponse.redirect(
          new URL(RouteEnum.AUTHENTICATED, nextUrl.origin),
        );
      }
    }

    return response;
  }

  if (!session.access) {
    if (!session.refresh) {
      return NextResponse.redirect(new URL(RouteEnum.LOGIN, nextUrl.origin));
    }

    const refreshedToken = await refreshAccessToken(session.refresh);

    if (!refreshedToken) {
      return NextResponse.redirect(new URL(RouteEnum.LOGIN, nextUrl.origin));
    }

    const inFiveMinutes = getFiveMinutes();

    response.cookies.set(CookiesEnum.SESSION, refreshedToken, {
      httpOnly: true,
      secure: true,
      expires: inFiveMinutes,
      path: "/",
    });

    return response;
  }

  if (session.user?.type === UserRoleEnum.COLLABORATOR) {
    if (!isCollaboratorRoute) {
      if (pathname !== RouteEnum.AUTHENTICATED) {
        return NextResponse.redirect(
          new URL(RouteEnum.AUTHENTICATED, nextUrl.origin),
        );
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|icon.ico|sitemap.xml|robots.txt|logo.svg|timezq_dark.svg|timezq_white.svg|zqlogo.svg).*)",
  ],
};

function buildHeaderWithUrl(
  request: MiddlewareRequest,
  response: NextResponse,
) {
  const url = new URL(request.url);
  const origin = url.origin;
  const pathname = url.pathname;

  response.headers.set("x-url", request.url);
  response.headers.set("x-origin", origin);
  response.headers.set("x-pathname", pathname);
}
