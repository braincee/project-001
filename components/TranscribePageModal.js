const { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Button } = require("@nextui-org/react")

const TranscribePageModal = ({ isOpen, onClose, handleTranscribe}) => {
  const handleClose = () => {
    onClose();
    handleTranscribe();
  }
  return (
    <>
      <Modal isOpen={isOpen}>
        <ModalContent>
          <ModalHeader>Retry transcription with different settings?</ModalHeader>
          <ModalBody>
            <h3 className="text-sm">
              Transcriptions already exist. Clicking RETRY will transcribe them again using different settings 🧙‍♂️
            </h3>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="outline" onPress={onClose}>
              ❌ Nevermind
            </Button>
            <Button onPress={handleClose}>
              ⏳ Yes, Retry
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default TranscribePageModal;