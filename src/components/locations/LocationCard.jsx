import { formatCurrency } from '../../utils/format'
import Card from '../shared/Card'
import Badge from '../shared/Badge'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-[var(--text-muted)]'}`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </div>
  )
}

export default function LocationCard({ location, onEdit, onDelete }) {
  const {
    id, name, region, estLandCost, acreage, rating,
    pros, cons, notes, distanceToHouston,
    internetAvailability, floodZone,
  } = location

  return (
    <Card className="hover:border-[var(--accent)]/30 transition-all">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold">{name}</h3>
            {region && <p className="text-sm text-[var(--text-muted)]">{region}</p>}
          </div>
          <StarRating rating={rating || 0} />
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-2">
          {estLandCost > 0 && (
            <div className="bg-[var(--bg-secondary)] rounded-lg p-2">
              <p className="text-xs text-[var(--text-muted)]">Est. Cost</p>
              <p className="font-mono text-sm font-semibold">{formatCurrency(estLandCost)}</p>
            </div>
          )}
          {acreage > 0 && (
            <div className="bg-[var(--bg-secondary)] rounded-lg p-2">
              <p className="text-xs text-[var(--text-muted)]">Acreage</p>
              <p className="font-mono text-sm font-semibold">{acreage} acres</p>
            </div>
          )}
          {distanceToHouston && (
            <div className="bg-[var(--bg-secondary)] rounded-lg p-2">
              <p className="text-xs text-[var(--text-muted)]">To Houston</p>
              <p className="text-sm font-medium">{distanceToHouston}</p>
            </div>
          )}
          {internetAvailability && (
            <div className="bg-[var(--bg-secondary)] rounded-lg p-2">
              <p className="text-xs text-[var(--text-muted)]">Internet</p>
              <p className="text-sm font-medium">{internetAvailability}</p>
            </div>
          )}
        </div>

        {floodZone && (
          <Badge color={floodZone === 'None' || floodZone === 'X' ? 'green' : 'red'}>
            Flood Zone: {floodZone}
          </Badge>
        )}

        {/* Pros/Cons */}
        {(pros?.length > 0 || cons?.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {pros?.map((p, i) => (
              <Badge key={`pro-${i}`} color="green">{p}</Badge>
            ))}
            {cons?.map((c, i) => (
              <Badge key={`con-${i}`} color="red">{c}</Badge>
            ))}
          </div>
        )}

        {/* Notes */}
        {notes && (
          <p className="text-xs text-[var(--text-muted)] line-clamp-2">{notes}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-color)]">
          <button
            onClick={() => onEdit(location)}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(id)}
            className="text-sm text-[var(--text-secondary)] hover:text-red-400 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  )
}
