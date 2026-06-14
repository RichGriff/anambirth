import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedListItemNode,
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
  Image as ImageProps,
  MediaBlock as MediaBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { cn } from '@/utilities/ui'
import { CallToAction } from '@/blocks/CallToAction/Component'
import { Img } from '@/blocks/Image/Component'

const ChecklistIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
    />
  </svg>
)

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      CallToActionProps | MediaBlockProps | BannerBlockProps | CodeBlockProps | ImageProps
    >

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

const renderChecklistList = ({
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
  const children = nodesToJSX({ nodes: node.children, parent: node })

  if (node.tag !== 'ul') {
    const NodeTag = node.tag
    return <NodeTag className={`list-${node.listType}`}>{children}</NodeTag>
  }

  return <ul className="ml-0 list-none pl-0 grid gap-4 md:grid-cols-2 md:gap-x-6 md:gap-y-4">{children}</ul>
}

const renderChecklistListItem = ({
  node,
  nodesToJSX,
  parent,
}: {
  node: SerializedListItemNode
  nodesToJSX: any
  parent: any
}) => {
  const children = nodesToJSX({ nodes: node.children, parent: node })
  const hasSubLists = node.children.some((child) => child.type === 'list')

  if (!parent || !('listType' in parent) || parent.listType !== 'bullet' || hasSubLists) {
    return <li>{children}</li>
  }

  return (
    <li className="flex gap-3 text-muted-foreground">
      <div className="mt-0.5 shrink-0 text-accent">
        <ChecklistIcon />
      </div>
      <div className="text-muted-foreground leading-relaxed [&_p]:m-0">{children}</div>
    </li>
  )
}

const createJSXConverters =
  (listVariant: NonNullable<Props['listVariant']>): JSXConvertersFunction<NodeTypes> =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    ...(listVariant === 'offering'
      ? {
          list: ({ node, nodesToJSX }) => renderOfferingList({ node, nodesToJSX }),
        }
      : listVariant === 'checklist'
        ? {
            list: ({ node, nodesToJSX }) => renderChecklistList({ node, nodesToJSX }),
            listitem: ({ node, nodesToJSX, parent }) =>
              renderChecklistListItem({ node, nodesToJSX, parent }),
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
      image: ({ node }) => <Img {...node.fields} />,
    },
  })

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  listVariant?: 'default' | 'offering' | 'checklist'
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
          'richtext-checklist': listVariant === 'checklist',
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
