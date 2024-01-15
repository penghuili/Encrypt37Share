import { Anchor, Text } from 'grommet';
import React from 'react';
import ContentWrapper from '../shared/react-pure/ContentWrapper';
import Divider from '../shared/react-pure/Divider';
import Spacer from '../shared/react-pure/Spacer';

function Footer() {
  return (
    <ContentWrapper>
      <Divider />
      <Spacer />
      <Text weight="bold">Share files encrypted and easily.</Text>
      <Text weight="bold">Open source, no account needed, no tracking and free forever.</Text>
      <Text>
        Encrypt37Share uses the famously{' '}
        <Anchor label="openpgpjs" href="https://github.com/openpgpjs/openpgpjs" target="_blank" />{' '}
        library to encrypt your files in your browser, before sending it to server.
      </Text>

      <Spacer />
      <Anchor href="https://encrypt37.com/share/" target="_blank">
        Learn more
      </Anchor>
      <Anchor href="https://github.com/penghuili/Encrypt37Share" target="_blank">
        Source code
      </Anchor>
      <Anchor href="https://buy.stripe.com/14k3fYcz633kb2oeV1" target="_blank">
        Buy me a beer 🍺
      </Anchor>
      <Text>
        Want to save your encrypted words and files to cloud, so it's easy to sync on different
        devices? Check{' '}
        <Anchor href="https://encrypt37.com" target="_blank">
          Encrypt37
        </Anchor>
      </Text>
      <Text>
        And check everything I build at{' '}
        <Anchor href="https://peng37.com" target="_blank">
          peng37.com
        </Anchor>
      </Text>
    </ContentWrapper>
  );
}

export default Footer;
