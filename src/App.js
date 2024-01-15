import React from 'react';
import { Provider as StoreProvider, useDispatch } from 'react-redux';
import { useLocation } from 'wouter';
import DownloadFile from './DownloadFile';
import ShareFile from './ShareFile';
import Footer from './components/Footer';
import { apps } from './shared/js/apps';
import createTheme from './shared/react-pure/createTheme';
import AppContainer from './shared/react/AppContainer';
import Toast from './shared/react/Toast';
import { HooksOutsieWrapper, setHook } from './shared/react/hooksOutside';
import initShared from './shared/react/initShared';
import store from './store';

initShared({
  logo: 'https://static.peng37.com/faviconapi/52190fe8-4549-4a16-b25b-3b42954128bc/4b8f8deee4a50fa57fb4d354e8e21f2e/icon-192.png',
  app: apps.sharefile.name,
  encryptionUrl: 'https://encrypt37.com/encryption/',
  privacyUrl: 'https://encrypt37.com/privacy/',
  termsUrl: 'https://encrypt37.com/terms/',
  hasSettings: false,
});

setHook('location', useLocation);
setHook('dispatch', useDispatch);

const theme = createTheme(apps.sharefile.color);

function getFileId() {
  const pathname = window.location.pathname;

  const fileId = pathname.split('/')[1];
  if (!fileId) {
    return null;
  }

  return fileId.trim();
}

function App() {
  const fileId = getFileId();

  return (
    <StoreProvider store={store}>
      <AppContainer theme={theme}>
        {fileId ? <DownloadFile fileId={fileId} /> : <ShareFile />}

        <Footer />

        <Toast />
      </AppContainer>
      <HooksOutsieWrapper />
    </StoreProvider>
  );
}

export default App;
