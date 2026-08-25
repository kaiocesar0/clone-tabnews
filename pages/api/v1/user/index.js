import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";
import session from "models/session";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const sessionToken = request.cookies.session_id;

  const sessionObject = await session.findOneValidByToken(sessionToken);
  const renewedSessionObject = await session.renew(sessionObject.id);
  await controller.setSessionCookie(response, renewedSessionObject.token);

  const userFound = await user.findOneById(sessionObject.user_id);
  console.log("userFound", userFound);
  return response.status(200).json(userFound);
}
