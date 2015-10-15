FROM opsee/nginx

MAINTAINER Greg Poirier <greg@opsee.co>

ENV BARTNET_HOST="api-beta.opsee.co"
ENV BARTNET_PORT="80"

RUN rm -f /etc/nginx/conf/nginx.conf
RUN ln -s /nginx.conf /etc/nginx/conf/nginx.conf