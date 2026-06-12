import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedListNode,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToAction as CallToActionProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { cn } from '@/utilities/ui'
import { CallToAction } from '@/blocks/CallToAction/Component'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<CallToActionProps | MediaBlockProps | BannerBlockProps | CodeBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const renderOfferingList = ({
  node,
  nodesToJSX,
}: {
  node: SerializedListNode
  nodesToJSX: ({
    nodes,
    parent,
  }: {
    nodes: SerializedListNode['children']
    parent?: SerializedListNode
  }) => React.ReactNode[]
}) => {
  const NodeTag = node.tag
  const allItems = nodesToJSX({ nodes: node.children, parent: node })

  if (node.tag !== 'ul' || node.children.length <= 1) {
    return <NodeTag className={`list-${node.listType}`}>{allItems}</NodeTag>
  }

  const splitIndex = Math.ceil(node.children.length / 2)
  const leftItems = nodesToJSX({ nodes: node.children.slice(0, splitIndex), parent: node })
  const rightItems = nodesToJSX({ nodes: node.children.slice(splitIndex), parent: node })
  const listClassName = `list-${node.listType} list-disc pl-6`

  return (
    <>
      <div className="lg:hidden">
        <ul className={listClassName}>{allItems}</ul>
      </div>
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-10">
        <ul className={listClassName}>{leftItems}</ul>
        <ul className={listClassName}>{rightItems}</ul>
      </div>
    </>
  )
}

const createJSXConverters = (
  listVariant: NonNullable<Props['listVariant']>,
): JSXConvertersFunction<NodeTypes> =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    ...(listVariant === 'offering'
      ? {
          list: ({ node, nodesToJSX }) => renderOfferingList({ node, nodesToJSX }),
        }
      : {}),
    quote: ({ node }) => (
      <blockquote className="border-l-2 border-primary/10 pl-4">
        <p className="font-(family-name:--font-cormorant) text-2xl font-light italic leading-relaxed text-foreground">
          {node.children?.map((child: any, index: number) => (
            <span key={index}>{child.text}</span>
          ))}
        </p>
      </blockquote>
    ),
    blocks: {
      banner: ({ node }) => <BannerBlock className="col-start-2 mb-4" {...node.fields} />,
      mediaBlock: ({ node }) => (
        <MediaBlock
          className="col-start-1 col-span-3"
          imgClassName="m-0"
          {...node.fields}
          captionClassName="mx-auto max-w-[48rem]"
          enableGutter={false}
          disableInnerContainer={true}
        />
      ),
      code: ({ node }) => <CodeBlock className="col-start-2" {...node.fields} />,
      cta: ({ node }) => <CallToAction {...node.fields} />,
    },
  })

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  listVariant?: 'default' | 'offering'
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const {
    className,
    enableProse = true,
    enableGutter = true,
    listVariant = 'default',
    ...rest
  } = props

  return (
    <ConvertRichText
      converters={createJSXConverters(listVariant)}
      className={cn(
        'payload-richtext richtext-site',
        {
          'richtext-default': listVariant === 'default',
          'richtext-offering': listVariant === 'offering',
        },
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md':
            // 'mx-auto prose md:prose-md prose-headings:text-foreground prose-p:text-muted-foreground':
            enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
