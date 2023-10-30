import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
} from '@nextui-org/react'

interface TranscribePageModalProps {
  isOpen: boolean
  onClose: () => void
  handleTranscribe: () => Promise<void>
}

const TranscribePageModal = (props: TranscribePageModalProps) => {
  const { isOpen, onClose, handleTranscribe } = props

  const handleClose = () => {
    onClose()
    handleTranscribe()
  }
  return (
    <>
      <Modal isOpen={isOpen}>
        <ModalContent>
          <ModalHeader>
            Retry transcription with different settings?
          </ModalHeader>
          <ModalBody>
            <h3 className='text-sm'>
              Transcriptions already exist. Clicking RETRY will transcribe them
              again using different settings 🧙‍♂️
            </h3>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='bordered' onPress={onClose}>
              ❌ Nevermind
            </Button>
            <Button onPress={handleClose} color='primary'>
              ⏳ Yes, Retry
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default TranscribePageModal
