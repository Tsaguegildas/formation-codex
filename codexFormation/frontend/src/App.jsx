import { Edit3, Loader2, Plus, RefreshCcw, Save, Search, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPhone, deletePhone, getPhones, updatePhone } from './api/phones.js';

const emptyForm = {
  brand: '',
  model: '',
  description: '',
  price: '',
  stockQuantity: '',
  imageUrl: '',
};

function formatPrice(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(Number(value || 0));
}

function normalizePhone(form) {
  return {
    brand: form.brand.trim(),
    model: form.model.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    stockQuantity: Number(form.stockQuantity),
    imageUrl: form.imageUrl.trim(),
  };
}

export default function App() {
  const [phones, setPhones] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const filteredPhones = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return phones;
    }

    return phones.filter((phone) => {
      return [phone.brand, phone.model, phone.description]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value));
    });
  }, [phones, search]);

  const totalStock = useMemo(() => {
    return phones.reduce((total, phone) => total + Number(phone.stockQuantity || 0), 0);
  }, [phones]);

  const averagePrice = useMemo(() => {
    if (phones.length === 0) {
      return 0;
    }

    const total = phones.reduce((sum, phone) => sum + Number(phone.price || 0), 0);
    return total / phones.length;
  }, [phones]);

  useEffect(() => {
    loadPhones();
  }, []);

  async function loadPhones() {
    setLoading(true);
    setError('');

    try {
      const data = await getPhones();
      setPhones(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEdit(phone) {
    setEditingId(phone.id);
    setForm({
      brand: phone.brand || '',
      model: phone.model || '',
      description: phone.description || '',
      price: phone.price ?? '',
      stockQuantity: phone.stockQuantity ?? '',
      imageUrl: phone.imageUrl || '',
    });
    setNotice('');
    setError('');
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');

    try {
      const payload = normalizePhone(form);
      const savedPhone = editingId
        ? await updatePhone(editingId, payload)
        : await createPhone(payload);

      setPhones((current) => {
        if (editingId) {
          return current.map((phone) => (phone.id === editingId ? savedPhone : phone));
        }

        return [...current, savedPhone];
      });

      setNotice(editingId ? 'Telephone modifie avec succes.' : 'Telephone ajoute avec succes.');
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(phone) {
    const confirmed = window.confirm(`Supprimer ${phone.brand} ${phone.model} ?`);

    if (!confirmed) {
      return;
    }

    setError('');
    setNotice('');

    try {
      await deletePhone(phone.id);
      setPhones((current) => current.filter((item) => item.id !== phone.id));
      setNotice('Telephone supprime avec succes.');

      if (editingId === phone.id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app-shell">
      <section className="topbar">
        <div>
          <p className="eyebrow">Gestion commerciale</p>
          <h1>Phone Store</h1>
        </div>
        <button className="secondary-button" type="button" onClick={loadPhones} disabled={loading}>
          <RefreshCcw size={18} />
          Actualiser
        </button>
      </section>

      <section className="stats-grid" aria-label="Indicateurs">
        <article className="metric">
          <span>Telephones</span>
          <strong>{phones.length}</strong>
        </article>
        <article className="metric">
          <span>Stock total</span>
          <strong>{totalStock}</strong>
        </article>
        <article className="metric">
          <span>Prix moyen</span>
          <strong>{formatPrice(averagePrice)}</strong>
        </article>
      </section>

      {(error || notice) && (
        <div className={error ? 'message error' : 'message success'} role="status">
          {error || notice}
        </div>
      )}

      <div className="workspace">
        <section className="inventory-panel">
          <div className="panel-heading">
            <div>
              <h2>Catalogue</h2>
              <p>{filteredPhones.length} resultat(s)</p>
            </div>
            <label className="search-box">
              <Search size={18} />
              <input
                type="search"
                placeholder="Rechercher"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          {loading ? (
            <div className="empty-state">
              <Loader2 className="spin" size={28} />
              Chargement du catalogue
            </div>
          ) : filteredPhones.length === 0 ? (
            <div className="empty-state">Aucun telephone trouve.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Prix</th>
                    <th>Stock</th>
                    <th aria-label="Actions"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPhones.map((phone) => (
                    <tr key={phone.id}>
                      <td>
                        <div className="product-cell">
                          <div className="phone-thumb">
                            {phone.imageUrl ? (
                              <img src={phone.imageUrl} alt={`${phone.brand} ${phone.model}`} />
                            ) : (
                              <span>{phone.brand?.slice(0, 1)}</span>
                            )}
                          </div>
                          <div>
                            <strong>{phone.brand} {phone.model}</strong>
                            <p>{phone.description}</p>
                          </div>
                        </div>
                      </td>
                      <td>{formatPrice(phone.price)}</td>
                      <td>
                        <span className={phone.stockQuantity > 0 ? 'stock-pill' : 'stock-pill empty'}>
                          {phone.stockQuantity}
                        </span>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            className="icon-button"
                            type="button"
                            aria-label="Modifier"
                            title="Modifier"
                            onClick={() => startEdit(phone)}
                          >
                            <Edit3 size={17} />
                          </button>
                          <button
                            className="icon-button danger"
                            type="button"
                            aria-label="Supprimer"
                            title="Supprimer"
                            onClick={() => handleDelete(phone)}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="editor-panel">
          <div className="panel-heading compact">
            <div>
              <h2>{editingId ? 'Modifier' : 'Ajouter'}</h2>
              <p>{editingId ? 'Mettre a jour le telephone' : 'Nouveau telephone'}</p>
            </div>
            {editingId && (
              <button className="icon-button" type="button" aria-label="Annuler" title="Annuler" onClick={resetForm}>
                <X size={18} />
              </button>
            )}
          </div>

          <form className="phone-form" onSubmit={handleSubmit}>
            <label>
              Marque
              <input name="brand" value={form.brand} onChange={updateField} required />
            </label>
            <label>
              Modele
              <input name="model" value={form.model} onChange={updateField} required />
            </label>
            <label>
              Description
              <textarea name="description" value={form.description} onChange={updateField} rows="4" required />
            </label>
            <div className="form-grid">
              <label>
                Prix
                <input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={updateField} required />
              </label>
              <label>
                Stock
                <input name="stockQuantity" type="number" min="0" value={form.stockQuantity} onChange={updateField} required />
              </label>
            </div>
            <label>
              Image URL
              <input name="imageUrl" type="url" value={form.imageUrl} onChange={updateField} placeholder="https://..." />
            </label>
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? <Loader2 className="spin" size={18} /> : editingId ? <Save size={18} /> : <Plus size={18} />}
              {editingId ? 'Enregistrer' : 'Ajouter'}
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}
