import { Anchor, Button, Text } from 'grommet';
import React, { useEffect, useState } from 'react';
import { RiLockUnlockLine } from 'react-icons/ri';
import { fetchFile } from '../shareFileNetwork';
import { decryptFileSymmetric, decryptMessageSymmetric } from '../shared/js/encryption';
import ContentWrapper from '../shared/react-pure/ContentWrapper';
import Divider from '../shared/react-pure/Divider';
import PasswordInput from '../shared/react-pure/PasswordInput';
import Spacer from '../shared/react-pure/Spacer';
import AppBar from '../shared/react/AppBar';
import { fetchResponseToUnit8Array } from '../shared/react/file';

function ShareFile({ fileId, onToast }) {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fileMeta, setFileMeta] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setFileMeta(null);
    fetchFile(fileId).then(({ data, error }) => {
      setIsLoading(false);
      if (error) {
        if (error.errorCode === 'NOT_FOUND') {
          setErrorMessage("File doesn't exist.");
        } else if (error.errorCode === 'EXPIRED') {
          setErrorMessage('File is expired.');
        } else {
          setErrorMessage('Something went wrong, please try again.');
        }
      } else {
        setFileMeta(data);
      }
    });
  }, [fileId]);

  return (
    <>
      <AppBar title="Download shared file" isLoading={isLoading} />
      <ContentWrapper>
        <PasswordInput
          label="Password to decrypt the file"
          value={password}
          onChange={p => {
            setErrorMessage(null);
            setPassword(p);
          }}
        />
        <Spacer />

        {!!errorMessage && <Text color="status-error">{errorMessage}</Text>}

        {!!fileMeta && (
          <>
            <Spacer />
            <Button
              primary
              label="Download & decrypt file"
              onClick={async () => {
                setErrorMessage(null);
                setIsDownloading(true);

                let fileName;
                try {
                  fileName = await decryptMessageSymmetric(password, fileMeta.fileName);
                } catch (error) {
                  setErrorMessage('Your password is wrong.');
                  setIsDownloading(false);
                  return;
                }

                try {
                  const link = `https://static.peng37.com/sharefile/${fileId}.e37`;
                  const response = await fetch(link);
                  const unit8Array = await fetchResponseToUnit8Array(response);
                  const decryptedFile = await decryptFileSymmetric(password, unit8Array);
                  const blob = new Blob([decryptedFile], { type: fileMeta.mimeType });
                  window.saveAs(blob, fileName);
                  onToast('Downloaded!');
                } catch (error) {
                  setErrorMessage('Something went wrong, please try again.');
                }

                setIsDownloading(false);
              }}
              icon={<RiLockUnlockLine />}
              disabled={isDownloading || isLoading || !fileMeta || !password}
            />
          </>
        )}

        <Spacer size="3rem" />
        <Divider />
        <Spacer />
        <Anchor href="https://share.encrypt37.com/" target="_blank">
          Share <Text weight="bold">YOUR</Text> file
        </Anchor>
      </ContentWrapper>
    </>
  );
}

export default ShareFile;
