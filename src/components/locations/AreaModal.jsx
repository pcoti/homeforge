import { useState, useEffect } from 'react'
import Modal from '../shared/Modal'
import Button from '../shared/Button'
import Input from '../shared/Input'
import Select from '../shared/Select'

const emptyForm = {
  name: '',
  state: 'Texas',
  county: '',
  metroArea: '',
  distanceToMetro: '',
  tags: '',
  lat: '',
  lng: '',
  // Climate
  avgHighSummer: '',
  avgLowWinter: '',
  annualRainfall: '',
  hardiness: '',
  // Infrastructure
  internetProviders: '',
  waterSource: '',
  electricProvider: '',
  cellCoverage: '',
  // Land
  avgPricePerAcre: 0,
  typicalLotSize: '',
  terrain: '',
  soilType: '',
  floodRisk: '',
  // Taxes
  propertyTaxRate: '',
  homesteadExemption: '',
  // Community
  schoolDistrict: '',
  nearestHospital: '',
  nearestGrocery: '',
  population: '',
  // Assessment
  pros: '',
  cons: '',
  notes: '',
  rating: 3,
}

export default function AreaModal({ open, onClose, onSave, area }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) {
      if (area) {
        setForm({
          name: area.name || '',
          state: area.state || 'Texas',
          county: area.county || '',
          metroArea: area.metroArea || '',
          distanceToMetro: area.distanceToMetro || '',
          tags: (area.tags || []).join(', '),
          lat: area.coordinates?.lat || '',
          lng: area.coordinates?.lng || '',
          avgHighSummer: area.climate?.avgHighSummer || '',
          avgLowWinter: area.climate?.avgLowWinter || '',
          annualRainfall: area.climate?.annualRainfall || '',
          hardiness: area.climate?.hardiness || '',
          internetProviders: area.infrastructure?.internetProviders || '',
          waterSource: area.infrastructure?.waterSource || '',
          electricProvider: area.infrastructure?.electricProvider || '',
          cellCoverage: area.infrastructure?.cellCoverage || '',
          avgPricePerAcre: area.landInfo?.avgPricePerAcre || 0,
          typicalLotSize: area.landInfo?.typicalLotSize || '',
          terrain: area.landInfo?.terrain || '',
          soilType: area.landInfo?.soilType || '',
          floodRisk: area.landInfo?.floodRisk || '',
          propertyTaxRate: area.taxInfo?.propertyTaxRate || '',
          homesteadExemption: area.taxInfo?.homesteadExemption || '',
          schoolDistrict: area.schoolDistrict || '',
          nearestHospital: area.nearestHospital || '',
          nearestGrocery: area.nearestGrocery || '',
          population: area.population || '',
          pros: (area.pros || []).join(', '),
          cons: (area.cons || []).join(', '),
          notes: area.notes || '',
          rating: area.rating || 3,
        })
      } else {
        setForm(emptyForm)
      }
    }
  }, [open, area])

  const handleSubmit = () => {
    if (!form.name.trim()) return
    onSave({
      name: form.name.trim(),
      state: form.state.trim(),
      county: form.county.trim(),
      metroArea: form.metroArea.trim(),
      distanceToMetro: form.distanceToMetro.trim(),
      tags: form.tags ? form.tags.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : [],
      coordinates: {
        lat: form.lat ? parseFloat(form.lat) : null,
        lng: form.lng ? parseFloat(form.lng) : null,
      },
      climate: {
        avgHighSummer: form.avgHighSummer.trim(),
        avgLowWinter: form.avgLowWinter.trim(),
        annualRainfall: form.annualRainfall.trim(),
        hardiness: form.hardiness.trim(),
      },
      infrastructure: {
        internetProviders: form.internetProviders.trim(),
        waterSource: form.waterSource.trim(),
        electricProvider: form.electricProvider.trim(),
        cellCoverage: form.cellCoverage.trim(),
      },
      landInfo: {
        avgPricePerAcre: Number(form.avgPricePerAcre) || 0,
        typicalLotSize: form.typicalLotSize.trim(),
        terrain: form.terrain.trim(),
        soilType: form.soilType.trim(),
        floodRisk: form.floodRisk.trim(),
      },
      taxInfo: {
        propertyTaxRate: form.propertyTaxRate.trim(),
        homesteadExemption: form.homesteadExemption.trim(),
      },
      schoolDistrict: form.schoolDistrict.trim(),
      nearestHospital: form.nearestHospital.trim(),
      nearestGrocery: form.nearestGrocery.trim(),
      population: form.population.trim(),
      pros: form.pros ? form.pros.split(',').map((s) => s.trim()).filter(Boolean) : [],
      cons: form.cons ? form.cons.split(',').map((s) => s.trim()).filter(Boolean) : [],
      notes: form.notes.trim(),
      rating: Number(form.rating) || 3,
    })
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={area ? 'Edit Area' : 'Add Area'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Identity */}
        <div>
          <h4 className="text-sm font-medium text-[var(--accent)] mb-3">Location Identity</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Area Name" value={form.name} onChange={set('name')} placeholder="e.g., Round Top / Carmine Area" />
            <Input label="State" value={form.state} onChange={set('state')} placeholder="e.g., Texas" />
            <Input label="County" value={form.county} onChange={set('county')} placeholder="e.g., Fayette County" />
            <Input label="Nearest Metro" value={form.metroArea} onChange={set('metroArea')} placeholder="e.g., Houston" />
            <Input label="Distance to Metro" value={form.distanceToMetro} onChange={set('distanceToMetro')} placeholder="e.g., 1.5 hours / 90 miles" />
            <Select label="Rating" value={form.rating} onChange={set('rating')} options={[
              { value: 1, label: '1 - Poor' }, { value: 2, label: '2 - Fair' },
              { value: 3, label: '3 - Good' }, { value: 4, label: '4 - Great' },
              { value: 5, label: '5 - Excellent' },
            ]} />
          </div>
          <Input label="Tags (comma-separated)" value={form.tags} onChange={set('tags')}
            placeholder="e.g., hill country, rural, low taxes, no HOA, hunting"
            className="mt-4" />
        </div>

        {/* Geography & Climate */}
        <div>
          <h4 className="text-sm font-medium text-[var(--accent)] mb-3">Geography & Climate</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input label="Latitude" value={form.lat} onChange={set('lat')} placeholder="e.g., 30.06" />
            <Input label="Longitude" value={form.lng} onChange={set('lng')} placeholder="e.g., -96.68" />
            <Input label="Avg High (Summer)" value={form.avgHighSummer} onChange={set('avgHighSummer')} placeholder="e.g., 96°F" />
            <Input label="Avg Low (Winter)" value={form.avgLowWinter} onChange={set('avgLowWinter')} placeholder="e.g., 38°F" />
            <Input label="Annual Rainfall" value={form.annualRainfall} onChange={set('annualRainfall')} placeholder="e.g., 40 inches" />
            <Input label="USDA Hardiness Zone" value={form.hardiness} onChange={set('hardiness')} placeholder="e.g., 8b" />
            <Input label="Terrain" value={form.terrain} onChange={set('terrain')} placeholder="e.g., Rolling hills" />
            <Input label="Soil Type" value={form.soilType} onChange={set('soilType')} placeholder="e.g., Sandy loam" />
          </div>
        </div>

        {/* Infrastructure */}
        <div>
          <h4 className="text-sm font-medium text-[var(--accent)] mb-3">Infrastructure & Utilities</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Internet Providers" value={form.internetProviders} onChange={set('internetProviders')} placeholder="e.g., Fiber (GVTC), Starlink, T-Mobile 5G" />
            <Input label="Water Source" value={form.waterSource} onChange={set('waterSource')} placeholder="e.g., Well water, Municipal" />
            <Input label="Electric Provider" value={form.electricProvider} onChange={set('electricProvider')} placeholder="e.g., Bluebonnet Electric Co-op" />
            <Input label="Cell Coverage" value={form.cellCoverage} onChange={set('cellCoverage')} placeholder="e.g., AT&T good, Verizon spotty" />
          </div>
        </div>

        {/* Land & Taxes */}
        <div>
          <h4 className="text-sm font-medium text-[var(--accent)] mb-3">Land & Taxes</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Avg Price per Acre" type="number" prefix="$" value={form.avgPricePerAcre} onChange={set('avgPricePerAcre')} />
            <Input label="Typical Lot Sizes" value={form.typicalLotSize} onChange={set('typicalLotSize')} placeholder="e.g., 5-50 acres" />
            <Input label="Flood Risk" value={form.floodRisk} onChange={set('floodRisk')} placeholder="e.g., Low, Zone X" />
            <Input label="Property Tax Rate" value={form.propertyTaxRate} onChange={set('propertyTaxRate')} placeholder="e.g., 1.8%" />
            <Input label="Homestead Exemption" value={form.homesteadExemption} onChange={set('homesteadExemption')} placeholder="e.g., $100K exemption" />
          </div>
        </div>

        {/* Community */}
        <div>
          <h4 className="text-sm font-medium text-[var(--accent)] mb-3">Community</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Population (area)" value={form.population} onChange={set('population')} placeholder="e.g., ~1,600" />
            <Input label="School District" value={form.schoolDistrict} onChange={set('schoolDistrict')} placeholder="e.g., Round Top-Carmine ISD" />
            <Input label="Nearest Hospital" value={form.nearestHospital} onChange={set('nearestHospital')} placeholder="e.g., St. Mark's, La Grange (25 min)" />
            <Input label="Nearest Grocery" value={form.nearestGrocery} onChange={set('nearestGrocery')} placeholder="e.g., HEB, Brenham (20 min)" />
          </div>
        </div>

        {/* Assessment */}
        <div>
          <h4 className="text-sm font-medium text-[var(--accent)] mb-3">Assessment</h4>
          <div className="space-y-4">
            <Input label="Pros (comma-separated)" value={form.pros} onChange={set('pros')} placeholder="e.g., Beautiful views, Low taxes, Quiet" />
            <Input label="Cons (comma-separated)" value={form.cons} onChange={set('cons')} placeholder="e.g., Far from hospitals, Limited internet" />
            <Input label="Notes" type="textarea" value={form.notes} onChange={set('notes')} placeholder="Overall impressions, things to research further..." />
          </div>
        </div>
      </div>
    </Modal>
  )
}
