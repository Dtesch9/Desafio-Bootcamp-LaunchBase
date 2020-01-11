const PhotosUpload = {
  input: '',
  addedPhotos: document.querySelector('#added-photos'),
  filesLimite: 5,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target // event.target == (#photos-input) and contain a property files which contain our filelist
    PhotosUpload.input = event.target

    if (PhotosUpload.hasLimite(event)) return

    Array.from(fileList).forEach(file => {
      PhotosUpload.files.push(file)

      const reader = new FileReader()

      reader.onload = () => { // Starts when ready
        const image = new Image()
        image.src = String(reader.result) // now we have our BLOB | result of reader.readAsDataURL(file)

        const div = PhotosUpload.createDivContainer(image)
        
        PhotosUpload.addedPhotos.appendChild(div)
      }

      reader.readAsDataURL(file) //  Whenever ready, onload starts | Throw BLOB as URL
    })

    PhotosUpload.input.files = PhotosUpload.getAllFiles()
  },
  hasLimite(event) {
    const { filesLimite, input, addedPhotos } = PhotosUpload
    const { files: fileList } = input

    if (fileList.length > filesLimite) {
      alert(`Permitido apenas ${filesLimite} imagens`)
      event.preventDefault()
      return true
    }

    const photosDiv = []
    addedPhotos.childNodes.forEach(item => {
      if (item.classList && item.classList.value == 'photo')
        photosDiv.push(item)
    })

    const totalPhotos = fileList.length + photosDiv.length
    if (totalPhotos > 5) {
      alert(`Você atingiu o limite máximo de  ${PhotosUpload.filesLimite} fotos`)
      event.preventDefault()
      return true
    }

    return false
  },
  getAllFiles() {
    const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

    PhotosUpload.files.forEach(file => dataTransfer.items.add(file))

    return dataTransfer.files
  },
  createDivContainer(image) {
    const div = document.createElement('div')
    div.classList.add('photo')

    div.onclick = PhotosUpload.removePhoto // onclick (Event listener click) automatically send the event to the function (removePhoto)

    div.appendChild(image)

    div.appendChild(PhotosUpload.createRemoveButton())

    return div
  },
  createRemoveButton() {
   const button = document.createElement('i')
   button.classList.add('material-icons')
    button.innerHTML = 'delete_forever'
   
   return button
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode // event.target is <i> | parrentNode is <div.photos>
    const photosArray = Array.from(PhotosUpload.addedPhotos.children)
    const index = photosArray.indexOf(photoDiv)

    PhotosUpload.files.splice(index, 1)
    PhotosUpload.input.files = PhotosUpload.getAllFiles()


    photoDiv.remove()
  }
}