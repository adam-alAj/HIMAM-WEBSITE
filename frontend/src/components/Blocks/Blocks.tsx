import type { ReactNode } from 'react'
import type {
  Blocks as BlocksValue,
  BlocksBlock,
  BlocksInline,
  BlocksListItem,
  BlocksText,
} from '../../lib/cms'
import styles from './Blocks.module.css'

/**
 * Renders Strapi "blocks" rich text (paragraphs, headings, lists, quotes,
 * code, links, inline formatting). Content is authored in the CMS admin by
 * non-technical editors — the renderer must tolerate any node Strapi emits.
 */

function InlineText({ node }: { node: BlocksText }): ReactNode {
  const { text, bold, italic, underline, strikethrough, code } = node
  let content: ReactNode = text
  if (code) content = <code className={styles.inlineCode}>{content}</code>
  if (bold) content = <strong>{content}</strong>
  if (italic) content = <em>{content}</em>
  if (underline) content = <u>{content}</u>
  if (strikethrough) content = <s>{content}</s>
  return content
}

function Inline({ node }: { node: BlocksInline }): ReactNode {
  if (node.type === 'link') {
    const external = node.target === '_blank'
    return (
      <a
        href={node.url}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {node.children.map((child, index) => (
          <InlineText key={index} node={child} />
        ))}
      </a>
    )
  }
  return <InlineText node={node} />
}

function ListItem({ node }: { node: BlocksListItem }): ReactNode {
  return (
    <li>
      {node.children.map((child, index) => {
        if (child.type === 'paragraph' || child.type === 'list') {
          return <Block key={index} node={child} />
        }
        return <Inline key={index} node={child} />
      })}
    </li>
  )
}

function Block({ node }: { node: BlocksBlock }): ReactNode {
  switch (node.type) {
    case 'paragraph':
      return (
        <p>
          {node.children.map((child, index) => (
            <Inline key={index} node={child} />
          ))}
        </p>
      )
    case 'heading': {
      // Cap at h2 — the page already owns h1.
      const level = Math.min(Math.max(node.level, 2), 6)
      const Tag = `h${level}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      return (
        <Tag>
          {node.children.map((child, index) => (
            <Inline key={index} node={child} />
          ))}
        </Tag>
      )
    }
    case 'quote':
      return (
        <blockquote>
          {node.children.map((child, index) => (
            <Inline key={index} node={child} />
          ))}
        </blockquote>
      )
    case 'code':
      return (
        <pre className={styles.codeBlock}>
          <code>
            {node.children.map((child, index) => (
              <Inline key={index} node={child} />
            ))}
          </code>
        </pre>
      )
    case 'list': {
      const items = node.children.map((item, index) => <ListItem key={index} node={item} />)
      return node.format === 'ordered' ? <ol>{items}</ol> : <ul>{items}</ul>
    }
    case 'image': {
      const src = node.image?.url
      if (!src) return null
      return (
        <figure className={styles.figure}>
          <img src={src} alt={node.image?.alternativeText ?? ''} />
        </figure>
      )
    }
    default:
      return null
  }
}

export function Blocks({ blocks }: { blocks: BlocksValue }) {
  return (
    <div className={styles.blocks}>
      {blocks.map((node, index) => (
        <Block key={index} node={node} />
      ))}
    </div>
  )
}
