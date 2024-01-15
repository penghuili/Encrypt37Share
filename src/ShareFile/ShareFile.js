import { Anchor, Button, FileInput, Text } from 'grommet';
import React, { useState } from 'react';
import { RiFileCopyLine, RiLockLine } from 'react-icons/ri';
import Beer from '../components/Beer';
import { getUploadUrl, uploadFile } from '../shareFileNetwork';
import { formatDateWeekTime } from '../shared/js/date';
import { encryptFile, encryptMessageSymmetric } from '../shared/js/encryption';
import ContentWrapper from '../shared/react-pure/ContentWrapper';
import PasswordInput from '../shared/react-pure/PasswordInput';
import Spacer from '../shared/react-pure/Spacer';
import AppBar from '../shared/react/AppBar';
import copyToClipboard from '../shared/react/copyToClipboard';
import { inputFileToUnit8Array } from '../shared/react/file';
import { toastTypes } from '../shared/react/store/sharedReducer';

function ShareFile({ onToast }) {
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [fileId, setFileId] = useState(null);
  const [fileMeta, setFileMeta] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AppBar title="Encrypt & share file" isLoading={isSharing} />
      <ContentWrapper>
        <PasswordInput label="Password" value={password} onChange={setPassword} />
        <Spacer />

        <Text weight="bold">Select file</Text>
        <FileInput
          name="file"
          onChange={event => {
            setErrorMessage(null);
            setFile(null);
            setFileId(null);
            setFileMeta(null);

            const fileList = event.target.files;
            const firstFile = fileList?.[0];
            if (!firstFile) {
              return;
            }

            // file size cannot exceed 50MB
            if (firstFile.size > 50 * 1024 * 1024) {
              setErrorMessage('File cannot exceed 50MB.');
              return;
            }

            setFile(firstFile);
          }}
          disabled={!password || isSharing}
        />
        {!!errorMessage && <Text color="status-error">{errorMessage}</Text>}
        <Spacer />

        <Button
          primary
          label="Encrypt & share"
          onClick={async () => {
            onToast('Encrypting...');
            setIsSharing(true);
            const unit8Array = await inputFileToUnit8Array(file);
            const encrpted = await encryptFile(unit8Array, password);
            const blob = new Blob([encrpted]);

            const encryptedFileName = await encryptMessageSymmetric(password, file.name);
            onToast('Uploading...');
            const { data } = await getUploadUrl(encryptedFileName, file.type);
            if (!data) {
              onToast('Something went wrong, please try again.', toastTypes.critical);
              setIsSharing(false);
              return;
            }

            const { url, shortId, file: fileMeta } = data;
            const { data: response } = await uploadFile(url, blob);
            if (!response) {
              onToast('Something went wrong, please try again.', toastTypes.critical);
              setIsSharing(false);
              return;
            }

            setIsSharing(false);
            setFileId(shortId);
            setFileMeta(fileMeta);
            onToast('Succeeded! You can copy the link below and share it with anyone.');
          }}
          icon={<RiLockLine />}
          disabled={!password || !file || isSharing}
        />
        <Spacer />

        {!!fileMeta && (
          <>
            <Text margin="3rem 0 0.5rem">
              Your file is encrpted and uploaded, you can share the link below with anyone.
            </Text>
            <Text margin="0 0 1rem">
              The link is valid for 7 days (until {formatDateWeekTime(fileMeta.expiresAt)}), the
              file will be deleted from server after that.
            </Text>
            <Anchor
              label={`share.encrypt37.com/${fileId}`}
              href={`https://share.encrypt37.com/${fileId}`}
              target="_blank"
            />
            <Button
              label="Copy link"
              onClick={() => {
                setShowModal(true);
              }}
              icon={<RiFileCopyLine />}
            />
          </>
        )}

        <Beer show={showModal} onClose={() => setShowModal(false)}>
          <Button
            label="Copy link"
            onClick={() => {
              copyToClipboard(`https://share.encrypt37.com/${fileId}`);
              setShowModal(false);
              onToast('Copied!');
            }}
            icon={<RiFileCopyLine />}
          />
        </Beer>
      </ContentWrapper>
    </>
  );
}

export default ShareFile;
