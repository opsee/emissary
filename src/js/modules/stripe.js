import config from './config';
if (window.Stripe && window.Stripe.setPublishableKey){
  window.Stripe.setPublishableKey(config.stripeKey);
}
export default window.Stripe;