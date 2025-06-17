'use client'

import { useRef, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  height?: number
  disabled?: boolean
  id?: string
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'İçeriğinizi buraya yazın...',
  height = 400,
  disabled = false,
  id
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null)

  const handleEditorChange = (content: string) => {
    onChange(content)
  }

  return (
    <div className="rich-text-editor">
      <Editor
        id={id}
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        disabled={disabled}
        init={{
          height: height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
              font-size: 14px;
              line-height: 1.6;
              color: #374151;
            }
            p { margin: 0 0 1rem 0; }
            h1, h2, h3, h4, h5, h6 { 
              font-family: 'Playfair Display', serif;
              margin: 1.5rem 0 1rem 0;
              color: #1f2937;
            }
            ul, ol { margin: 1rem 0; padding-left: 2rem; }
            blockquote { 
              margin: 1.5rem 0; 
              padding: 1rem 1.5rem; 
              border-left: 4px solid #d1d5db; 
              background: #f9fafb;
              font-style: italic;
            }
            img { max-width: 100%; height: auto; }
            table { 
              border-collapse: collapse; 
              width: 100%; 
              margin: 1rem 0; 
            }
            table td, table th { 
              border: 1px solid #d1d5db; 
              padding: 0.5rem; 
            }
            table th { 
              background: #f3f4f6; 
              font-weight: 600; 
            }
          `,
          placeholder: placeholder,
          branding: false,
          resize: true,
          elementpath: false,
          statusbar: true,
          language: 'tr',
          directionality: 'ltr',
          paste_data_images: true,
          automatic_uploads: true,
          file_picker_types: 'image',
          setup: (editor) => {
            editor.on('focus', () => {
              // Add focus styles
              editor.getContainer()?.classList.add('editor-focused')
            })
            
            editor.on('blur', () => {
              // Remove focus styles
              editor.getContainer()?.classList.remove('editor-focused')
            })
          },
          // Custom image upload handler
          images_upload_handler: async (blobInfo: any, progress: any) => {
            // For now, we'll use a placeholder image URL
            // In production, you would upload to your media service
            const placeholder = `data:${blobInfo.blob().type};base64,${blobInfo.base64()}`
            return Promise.resolve(placeholder)
          }
        }}
      />
      
      <style jsx global>{`
        .tox-tinymce {
          border: 1px solid #d1d5db !important;
          border-radius: 0.5rem !important;
          font-family: inherit !important;
        }
        
        .tox-toolbar {
          background: #f9fafb !important;
          border-bottom: 1px solid #e5e7eb !important;
        }
        
        .tox-toolbar__primary {
          background: transparent !important;
        }
        
        .tox-tbtn {
          border-radius: 0.25rem !important;
          margin: 0 1px !important;
        }
        
        .tox-tbtn:hover {
          background: #e5e7eb !important;
        }
        
        .tox-tbtn--enabled {
          background: #dbeafe !important;
          color: #1d4ed8 !important;
        }
        
        .tox-edit-area {
          border: none !important;
        }
        
        .tox-edit-area__iframe {
          background: white !important;
        }
        
        .tox-statusbar {
          background: #f9fafb !important;
          border-top: 1px solid #e5e7eb !important;
          padding: 0.5rem !important;
        }
        
        .editor-focused .tox-tinymce {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        .tox-notification {
          display: none !important;
        }
        
        .rich-text-editor .tox-tinymce {
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        
        /* Dark mode support for future */
        @media (prefers-color-scheme: dark) {
          .tox-tinymce {
            border-color: #4b5563 !important;
          }
          
          .tox-toolbar {
            background: #374151 !important;
            border-bottom-color: #4b5563 !important;
          }
          
          .tox-statusbar {
            background: #374151 !important;
            border-top-color: #4b5563 !important;
          }
        }
      `}</style>
    </div>
  )
}