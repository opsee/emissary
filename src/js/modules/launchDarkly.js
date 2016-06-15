export const ldclient = window.ldclient || {};

/**
 * A note about identifying users with Launch Darkly:
 *
 * The Launch Darkly client resolves the result of a toggle() call right away
 * using only the information you `identify` with. If you are going to
 * include/exclude users based on attributes other than LD key, such as email
 * or admin status, they must be included in the userData object.
 *
 * So, for example, if you whitelist test@opsee.com for a feature flag, but call
 *
 *    identify({ id: 1234 })
 *
 * ...calling ldclient.toggle('some-feature-flag') will NOT work, since you have
 * not identified the user with the attribute (email, in this case)
 * with which you've whitelisted them. At a minimum, you have to call
 *
 *    identify({ id: 1234, email: 'test@opsee.com' })
 *
 */
export function identify(userData) {
  const ldUser = {
    firstName: userData.name,
    key: (userData.id || '').toString(),
    email: userData.email,
    custom: {
      customer_id: userData.customer_id,
      id: userData.id,
      admin: !!userData.admin
    }
  };
  ldclient.identify(ldUser);
}