type RelationshipId = number | string

/**
 * Narrows a Payload relationship value from ID-or-document to document.
 */
export const isPopulatedRelationship = <T extends object>(
  value: T | RelationshipId | null | undefined,
): value is T => {
  return typeof value === 'object' && value !== null
}
