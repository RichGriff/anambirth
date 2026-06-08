'use client'

import React, { useState } from 'react'
import { Button } from './button'
import { Share2Icon, CheckIcon } from 'lucide-react'

interface ShareButtonProps {
  title?: string
  text?: string
  url?: string
  className?: string
}

const ShareButton = ({ title, text, url, className }: ShareButtonProps) => {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = url ?? window.location.href
    const shareData = { title, text, url: shareUrl }

    // Use native share sheet if available (mobile + some desktop browsers)
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        // User cancelled or share failed — fall through to clipboard
        if ((err as DOMException).name === 'AbortError') return
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Last resort for older browsers
      const el = document.createElement('input')
      el.value = shareUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      className={`ml-2 hover:cursor-pointer relative ${className}`}
      onClick={handleShare}
      aria-label={copied ? 'Link copied!' : 'Share this page'}
      title={copied ? 'Link copied!' : 'Share'}
    >
      {copied ? (
        <CheckIcon className="w-5 h-5 text-green-500 transition-colors" />
      ) : (
        <Share2Icon className="w-5 h-5 transition-colors" />
      )}
    </Button>
  )
}

export default ShareButton
