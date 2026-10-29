import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import React from 'react'

const getPageHref = (page: number) => (page <= 1 ? '/posts' : `/posts/page/${page}`)

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
}> = (props) => {
  const { className, page, totalPages } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          {hasPrevPage && (
            <PaginationItem>
              <PaginationPrevious href={getPageHref(page - 1)} />
            </PaginationItem>
          )}

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink href={getPageHref(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink href={getPageHref(page)} isActive>
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink href={getPageHref(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {hasNextPage && (
            <PaginationItem>
              <PaginationNext href={getPageHref(page + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
