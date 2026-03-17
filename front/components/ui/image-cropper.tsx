'use client'

import Cropper from 'react-easy-crop'
import { useCallback, useState } from 'react'
import { Button } from './button'
import { Slider } from './slider'

type ImageCropperProps = {
  imageSrc: string
  onCropComplete: (file: File, preview: string) => void
  onCancel: () => void
}

export function ImageCropper ({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

  const onCropCompleteCallback = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    const { file, url } = await getCroppedImg(imageSrc, croppedAreaPixels)
    onCropComplete(file, url)
  }

  return (
    <div className='relative w-full h-[400px] bg-black rounded-md overflow-hidden'>
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        cropShape='round'
        showGrid={false}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropCompleteCallback}
      />
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 items-center bg-background p-2 rounded shadow'>
        <Slider value={[zoom]} onValueChange={([z]) => setZoom(z)} min={1} max={3} step={0.1} className='w-40' />
        <Button type='button' onClick={handleSave}>
          Salvar
        </Button>
        <Button type='button' variant='ghost' onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}

export function getCroppedImg(imageSrc: string, crop: any): Promise<{ file: File; url: string }> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = imageSrc
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject('Erro ao gerar contexto do canvas')

      ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)

      canvas.toBlob((blob) => {
        if (!blob) return reject('Erro ao gerar imagem')
        const file = new File([blob], 'avatar.jpeg', { type: 'image/jpeg' })
        const url = URL.createObjectURL(blob)
        resolve({ file, url })
      }, 'image/jpeg')
    }
    image.onerror = reject
  })
}
