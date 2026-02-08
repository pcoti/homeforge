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

const statusColors = {
  researching: 'blue',
  contacted: 'amber',
  visited: 'purple',
  offer: 'green',
  passed: 'gray',
}

// Property card (nested under an area)
export function PropertyCard({ property, onEdit, onDelete }) {
  const { id, name, estLandCost, acreage, status, pros, cons, floodZone, listingUrl } = property

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg p-3 hover:border-[var(--accent)]/30 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{name}</span>
            <Badge color={statusColors[status]}>{status}</Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-muted)]">
            {estLandCost > 0 && <span className="font-mono">{formatCurrency(estLandCost)}</span>}
            {acreage > 0 && <span>{acreage} acres</span>}
            {estLandCost > 0 && acreage > 0 && (
              <span className="font-mono">{formatCurrency(Math.round(estLandCost / acreage))}/acre</span>
            )}
            {floodZone && <span>Flood: {floodZone}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {listingUrl && (
            <a href={listingUrl} target="_blank" rel="noopener noreferrer"
              className="p-1 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}
          <button onClick={() => onEdit(property)}
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </button>
          <button onClick={() => onDelete(id)}
            className="p-1 text-[var(--text-muted)] hover:text-red-400 transition-colors cursor-pointer">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      {(pros?.length > 0 || cons?.length > 0) && (
        <div className="flex flex-wrap gap-1 mt-2">
          {pros?.map((p, i) => <Badge key={`p-${i}`} color="green">{p}</Badge>)}
          {cons?.map((c, i) => <Badge key={`c-${i}`} color="red">{c}</Badge>)}
        </div>
      )}
    </div>
  )
}

// Area card (top-level region/county)
export default function AreaCard({ area, properties, expanded, onToggle, onEdit, onDelete, onAddProperty, onEditProperty, onDeleteProperty }) {
  const propCount = properties.length

  return (
    <Card className="hover:border-[var(--accent)]/20 transition-all">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <button onClick={onToggle} className="flex-1 text-left cursor-pointer">
            <div className="flex items-center gap-2">
              <svg className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${expanded ? 'rotate-90' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
              <h3 className="font-serif text-lg font-semibold">{area.name}</h3>
            </div>
            <p className="text-sm text-[var(--text-muted)] ml-6">
              {[area.county, area.state].filter(Boolean).join(', ')}
              {area.metroArea && ` — ${area.distanceToMetro || '?'} from ${area.metroArea}`}
            </p>
          </button>
          <div className="flex items-center gap-2 flex-shrink-0">
            <StarRating rating={area.rating || 0} />
          </div>
        </div>

        {/* Tags */}
        {area.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 ml-6">
            {area.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Quick stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 ml-6">
          {area.landInfo?.avgPricePerAcre > 0 && (
            <div className="bg-[var(--bg-secondary)] rounded-lg p-2">
              <p className="text-xs text-[var(--text-muted)]">Avg $/Acre</p>
              <p className="font-mono text-sm font-semibold">{formatCurrency(area.landInfo.avgPricePerAcre)}</p>
            </div>
          )}
          {area.taxInfo?.propertyTaxRate && (
            <div className="bg-[var(--bg-secondary)] rounded-lg p-2">
              <p className="text-xs text-[var(--text-muted)]">Tax Rate</p>
              <p className="text-sm font-medium">{area.taxInfo.propertyTaxRate}</p>
            </div>
          )}
          {area.infrastructure?.internetProviders && (
            <div className="bg-[var(--bg-secondary)] rounded-lg p-2">
              <p className="text-xs text-[var(--text-muted)]">Internet</p>
              <p className="text-sm font-medium truncate">{area.infrastructure.internetProviders}</p>
            </div>
          )}
          {area.landInfo?.floodRisk && (
            <div className="bg-[var(--bg-secondary)] rounded-lg p-2">
              <p className="text-xs text-[var(--text-muted)]">Flood Risk</p>
              <p className="text-sm font-medium">{area.landInfo.floodRisk}</p>
            </div>
          )}
        </div>

        {/* Pros/Cons */}
        {(area.pros?.length > 0 || area.cons?.length > 0) && (
          <div className="flex flex-wrap gap-1.5 ml-6">
            {area.pros?.map((p, i) => <Badge key={`pro-${i}`} color="green">{p}</Badge>)}
            {area.cons?.map((c, i) => <Badge key={`con-${i}`} color="red">{c}</Badge>)}
          </div>
        )}

        {/* Expanded: show details + properties */}
        {expanded && (
          <div className="ml-6 space-y-4 pt-2 border-t border-[var(--border-color)]">
            {/* Area details grid */}
            {(area.climate?.avgHighSummer || area.infrastructure?.waterSource || area.schoolDistrict || area.coordinates?.lat) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {area.climate?.avgHighSummer && (
                  <div><span className="text-[var(--text-muted)]">Summer High:</span> {area.climate.avgHighSummer}</div>
                )}
                {area.climate?.avgLowWinter && (
                  <div><span className="text-[var(--text-muted)]">Winter Low:</span> {area.climate.avgLowWinter}</div>
                )}
                {area.climate?.annualRainfall && (
                  <div><span className="text-[var(--text-muted)]">Rainfall:</span> {area.climate.annualRainfall}</div>
                )}
                {area.infrastructure?.waterSource && (
                  <div><span className="text-[var(--text-muted)]">Water:</span> {area.infrastructure.waterSource}</div>
                )}
                {area.infrastructure?.electricProvider && (
                  <div><span className="text-[var(--text-muted)]">Electric:</span> {area.infrastructure.electricProvider}</div>
                )}
                {area.infrastructure?.cellCoverage && (
                  <div><span className="text-[var(--text-muted)]">Cell:</span> {area.infrastructure.cellCoverage}</div>
                )}
                {area.schoolDistrict && (
                  <div><span className="text-[var(--text-muted)]">Schools:</span> {area.schoolDistrict}</div>
                )}
                {area.nearestHospital && (
                  <div><span className="text-[var(--text-muted)]">Hospital:</span> {area.nearestHospital}</div>
                )}
                {area.nearestGrocery && (
                  <div><span className="text-[var(--text-muted)]">Grocery:</span> {area.nearestGrocery}</div>
                )}
                {area.population && (
                  <div><span className="text-[var(--text-muted)]">Population:</span> {area.population}</div>
                )}
                {area.coordinates?.lat && (
                  <div><span className="text-[var(--text-muted)]">Coords:</span> {area.coordinates.lat}, {area.coordinates.lng}</div>
                )}
                {area.landInfo?.terrain && (
                  <div><span className="text-[var(--text-muted)]">Terrain:</span> {area.landInfo.terrain}</div>
                )}
                {area.landInfo?.soilType && (
                  <div><span className="text-[var(--text-muted)]">Soil:</span> {area.landInfo.soilType}</div>
                )}
                {area.taxInfo?.homesteadExemption && (
                  <div><span className="text-[var(--text-muted)]">Homestead:</span> {area.taxInfo.homesteadExemption}</div>
                )}
              </div>
            )}

            {area.notes && (
              <p className="text-sm text-[var(--text-secondary)]">{area.notes}</p>
            )}

            {/* Properties */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Properties ({propCount})</h4>
                <button onClick={onAddProperty}
                  className="text-xs text-[var(--accent)] hover:underline cursor-pointer">
                  + Add Property
                </button>
              </div>
              {propCount === 0 ? (
                <p className="text-xs text-[var(--text-muted)] py-2">No properties saved in this area yet.</p>
              ) : (
                <div className="space-y-2">
                  {properties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      onEdit={onEditProperty}
                      onDelete={onDeleteProperty}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
          <span className="text-xs text-[var(--text-muted)]">
            {propCount} {propCount === 1 ? 'property' : 'properties'}
          </span>
          <div className="flex items-center gap-3">
            <button onClick={() => onEdit(area)}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">
              Edit Area
            </button>
            <button onClick={() => onDelete(area.id)}
              className="text-sm text-[var(--text-secondary)] hover:text-red-400 transition-colors cursor-pointer">
              Delete
            </button>
          </div>
        </div>
      </div>
    </Card>
  )
}
