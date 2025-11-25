import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import styles from './FilterSidebar.module.css';

/**
 * Composant générique pour afficher un filtre dynamique
 * Supporte plusieurs types: select, range, number, text, checkbox, checkboxes, dynamic-brands, dynamic-models
 */
export default function DynamicFilter({ filter, value, onChange, parentValue }) {
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les options dynamiques depuis la BDD
  useEffect(() => {
    if (filter.type === 'dynamic-brands') {
      loadBrands();
    } else if (filter.type === 'dynamic-models' && parentValue) {
      loadModels(parentValue);
    } else if (filter.type === 'dynamic-subcategories') {
      loadSubcategories(filter.parentCategorySlug);
    }
  }, [filter.type, parentValue, filter.parentCategorySlug]);

  const loadBrands = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('brands')
      .select('id, name')
      .order('name');

    if (data) {
      setDynamicOptions(data.map(b => ({ value: b.id, label: b.name })));
    }
    setLoading(false);
  };

  const loadModels = async (brandId) => {
    setLoading(true);
    const { data } = await supabase
      .from('models')
      .select('id, name')
      .eq('brand_id', brandId)
      .order('name');

    if (data) {
      setDynamicOptions(data.map(m => ({ value: m.id, label: m.name })));
    }
    setLoading(false);
  };

  const loadSubcategories = async (parentCategorySlug) => {
    setLoading(true);

    // Récupérer l'ID de la catégorie parent
    const { data: parentCat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', parentCategorySlug)
      .maybeSingle();

    if (parentCat) {
      // Récupérer les sous-catégories
      const { data } = await supabase
        .from('categories')
        .select('id, name_fr')
        .eq('parent_id', parentCat.id)
        .order('display_order');

      if (data) {
        setDynamicOptions(data.map(c => ({ value: c.id, label: c.name_fr })));
      }
    }

    setLoading(false);
  };

  // Affichage selon le type de filtre
  const renderFilter = () => {
    switch (filter.type) {
      case 'select':
      case 'dynamic-brands':
      case 'dynamic-models':
      case 'dynamic-subcategories':
        return (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {filter.icon} {filter.label}
            </label>
            <select
              value={value || ''}
              onChange={(e) => onChange(filter.id, e.target.value)}
              className={styles.select}
              disabled={loading || (filter.type === 'dynamic-models' && !parentValue)}
            >
              <option value="">
                {loading ? 'Chargement...' :
                 filter.type === 'dynamic-models' && !parentValue ? 'Sélectionnez une marque' :
                 'Tous'}
              </option>
              {(filter.options || dynamicOptions).map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'range':
        const minValue = value?.[filter.fields.min] || '';
        const maxValue = value?.[filter.fields.max] || '';

        return (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {filter.icon} {filter.label}
            </label>
            <div className={styles.priceInputs}>
              <input
                type="number"
                placeholder={filter.placeholder?.min || 'Min'}
                value={minValue}
                onChange={(e) => {
                  const newValue = {
                    ...(value || {}),
                    [filter.fields.min]: e.target.value
                  };
                  onChange(filter.id, newValue);
                }}
                className={styles.input}
                min={filter.min}
                max={filter.max}
              />
              <span>-</span>
              <input
                type="number"
                placeholder={filter.placeholder?.max || 'Max'}
                value={maxValue}
                onChange={(e) => {
                  const newValue = {
                    ...(value || {}),
                    [filter.fields.max]: e.target.value
                  };
                  onChange(filter.id, newValue);
                }}
                className={styles.input}
                min={filter.min}
                max={filter.max}
              />
            </div>
          </div>
        );

      case 'number':
        return (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {filter.icon} {filter.label}
            </label>
            <input
              type="number"
              placeholder={filter.placeholder || 'Nombre'}
              value={value || ''}
              onChange={(e) => onChange(filter.id, e.target.value)}
              className={styles.input}
              min={filter.min}
              max={filter.max}
            />
          </div>
        );

      case 'text':
        return (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {filter.icon} {filter.label}
            </label>
            <input
              type="text"
              placeholder={filter.placeholder || ''}
              value={value || ''}
              onChange={(e) => onChange(filter.id, e.target.value)}
              className={styles.input}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={value === true}
                onChange={(e) => onChange(filter.id, e.target.checked ? true : null)}
              />
              <span>{filter.icon} {filter.label}</span>
            </label>
          </div>
        );

      case 'checkboxes':
        const selectedValues = value || [];

        return (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              {filter.icon} {filter.label}
            </label>
            <div className={styles.checkboxGroup}>
              {filter.options.map(opt => (
                <label key={opt.value} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(opt.value)}
                    onChange={(e) => {
                      let newValues;
                      if (e.target.checked) {
                        newValues = [...selectedValues, opt.value];
                      } else {
                        newValues = selectedValues.filter(v => v !== opt.value);
                      }
                      onChange(filter.id, newValues.length > 0 ? newValues : null);
                    }}
                  />
                  <span>{opt.icon} {opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderFilter();
}
