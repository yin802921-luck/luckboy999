const storageKey = 'gift-quotation-products-v1';

const sampleProducts = [
  { id: crypto.randomUUID(), name: '香薰蜡烛礼盒', category: '家居礼品', wholesale: 38, retail: 68, tags: '氛围感、节日、女性客户' },
  { id: crypto.randomUUID(), name: '保温杯套装', category: '实用办公', wholesale: 46, retail: 89, tags: '高频使用、企业定制' },
  { id: crypto.randomUUID(), name: '真丝眼罩', category: '旅行出行', wholesale: 28, retail: 58, tags: '轻奢、睡眠、差旅' },
  { id: crypto.randomUUID(), name: '坚果零食礼盒', category: '食品礼盒', wholesale: 72, retail: 128, tags: '大众、节庆、家庭' },
  { id: crypto.randomUUID(), name: '蓝牙小音箱', category: '数码周边', wholesale: 88, retail: 169, tags: '年轻、科技、活力' },
  { id: crypto.randomUUID(), name: '商务笔记本套装', category: '实用办公', wholesale: 32, retail: 66, tags: '会议、员工福利' },
  { id: crypto.randomUUID(), name: '便携雨伞', category: '旅行出行', wholesale: 35, retail: 79, tags: '实用、四季、轻便' },
  { id: crypto.randomUUID(), name: '陶瓷马克杯', category: '家居礼品', wholesale: 22, retail: 49, tags: '日常、可印 Logo' },
  { id: crypto.randomUUID(), name: '护手霜套装', category: '个护美妆', wholesale: 42, retail: 86, tags: '冬季、女性、精致' },
  { id: crypto.randomUUID(), name: '茶叶品鉴装', category: '食品礼盒', wholesale: 58, retail: 118, tags: '商务、传统、健康' },
  { id: crypto.randomUUID(), name: '无线充电底座', category: '数码周边', wholesale: 65, retail: 139, tags: '办公桌面、手机配件' },
  { id: crypto.randomUUID(), name: '迷你筋膜球', category: '健康运动', wholesale: 24, retail: 55, tags: '放松、运动、便携' }
];

let products = loadProducts();
let latestPackages = [];

const elements = {
  productCount: document.querySelector('#product-count'),
  categoryCount: document.querySelector('#category-count'),
  minPrice: document.querySelector('#min-price'),
  avgPrice: document.querySelector('#avg-price'),
  plannerForm: document.querySelector('#planner-form'),
  budgetInput: document.querySelector('#budget-input'),
  priceMode: document.querySelector('#price-mode'),
  maxItems: document.querySelector('#max-items'),
  planCount: document.querySelector('#plan-count'),
  categoryPreferences: document.querySelector('#category-preferences'),
  plannerStatus: document.querySelector('#planner-status'),
  packageResults: document.querySelector('#package-results'),
  copyResults: document.querySelector('#copy-results'),
  productForm: document.querySelector('#product-form'),
  productId: document.querySelector('#product-id'),
  productName: document.querySelector('#product-name'),
  productCategory: document.querySelector('#product-category'),
  categoryOptions: document.querySelector('#category-options'),
  wholesalePrice: document.querySelector('#wholesale-price'),
  retailPrice: document.querySelector('#retail-price'),
  productTags: document.querySelector('#product-tags'),
  saveProduct: document.querySelector('#save-product'),
  productTable: document.querySelector('#product-table'),
  searchProducts: document.querySelector('#search-products'),
  filterCategory: document.querySelector('#filter-category'),
  exportProducts: document.querySelector('#export-products'),
  resetProducts: document.querySelector('#reset-products')
};

renderAll();
generateAndRenderPackages();

elements.plannerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  generateAndRenderPackages();
});

elements.productForm.addEventListener('submit', (event) => {
  event.preventDefault();
  saveProduct();
});

elements.productTable.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const product = products.find((item) => item.id === button.dataset.id);
  if (!product) return;

  if (button.dataset.action === 'edit') editProduct(product);
  if (button.dataset.action === 'delete') deleteProduct(product.id);
});

elements.searchProducts.addEventListener('input', renderProductTable);
elements.filterCategory.addEventListener('change', renderProductTable);
elements.copyResults.addEventListener('click', copyPackages);
elements.exportProducts.addEventListener('click', exportProducts);
elements.resetProducts.addEventListener('click', () => {
  products = sampleProducts.map((product) => ({ ...product, id: crypto.randomUUID() }));
  persistProducts();
  clearProductForm();
  renderAll();
  generateAndRenderPackages();
});

function loadProducts() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return sampleProducts;

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : sampleProducts;
  } catch {
    return sampleProducts;
  }
}

function persistProducts() {
  localStorage.setItem(storageKey, JSON.stringify(products));
}

function renderAll() {
  renderMetrics();
  renderCategoryControls();
  renderProductTable();
}

function renderMetrics() {
  const categories = uniqueCategories();
  const wholesalePrices = products.map((item) => item.wholesale);
  const retailPrices = products.map((item) => item.retail);
  const averageRetail = retailPrices.reduce((sum, price) => sum + price, 0) / (retailPrices.length || 1);

  elements.productCount.textContent = products.length;
  elements.categoryCount.textContent = categories.length;
  elements.minPrice.textContent = formatCurrency(wholesalePrices.length ? Math.min(...wholesalePrices) : 0);
  elements.avgPrice.textContent = formatCurrency(averageRetail);
}

function renderCategoryControls() {
  const categories = uniqueCategories();
  const preferenceValues = selectedPreferenceCategories();
  elements.categoryPreferences.innerHTML = categories
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join('');
  Array.from(elements.categoryPreferences.options).forEach((option) => {
    option.selected = preferenceValues.includes(option.value);
  });

  elements.categoryOptions.innerHTML = categories
    .map((category) => `<option value="${escapeHtml(category)}"></option>`)
    .join('');
  const currentFilter = elements.filterCategory.value;
  elements.filterCategory.innerHTML = '<option value="all">全部类别</option>' + categories
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join('');
  elements.filterCategory.value = categories.includes(currentFilter) ? currentFilter : 'all';
}

function renderProductTable() {
  const keyword = elements.searchProducts.value.trim().toLowerCase();
  const category = elements.filterCategory.value;
  const rows = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const haystack = `${product.name} ${product.category} ${product.tags}`.toLowerCase();
    return matchesCategory && haystack.includes(keyword);
  });

  elements.productTable.innerHTML = rows.map((product) => `
    <tr>
      <td><strong>${escapeHtml(product.name)}</strong></td>
      <td><span class="pill">${escapeHtml(product.category)}</span></td>
      <td>${formatCurrency(product.wholesale)}</td>
      <td>${formatCurrency(product.retail)}</td>
      <td>${escapeHtml(product.tags || '—')}</td>
      <td class="actions">
        <button type="button" class="small" data-action="edit" data-id="${product.id}">编辑</button>
        <button type="button" class="small danger" data-action="delete" data-id="${product.id}">删除</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="6" class="empty">暂无匹配产品，请调整搜索条件或新增产品。</td></tr>';
}

function saveProduct() {
  const product = {
    id: elements.productId.value || crypto.randomUUID(),
    name: elements.productName.value.trim(),
    category: elements.productCategory.value.trim(),
    wholesale: Number(elements.wholesalePrice.value),
    retail: Number(elements.retailPrice.value),
    tags: elements.productTags.value.trim()
  };

  if (!product.name || !product.category || product.wholesale < 0 || product.retail < 0) return;

  const existingIndex = products.findIndex((item) => item.id === product.id);
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products = [product, ...products];
  }

  persistProducts();
  clearProductForm();
  renderAll();
}

function editProduct(product) {
  elements.productId.value = product.id;
  elements.productName.value = product.name;
  elements.productCategory.value = product.category;
  elements.wholesalePrice.value = product.wholesale;
  elements.retailPrice.value = product.retail;
  elements.productTags.value = product.tags;
  elements.saveProduct.textContent = '保存修改';
  elements.productName.focus();
}

function deleteProduct(productId) {
  products = products.filter((product) => product.id !== productId);
  persistProducts();
  renderAll();
  generateAndRenderPackages();
}

function clearProductForm() {
  elements.productForm.reset();
  elements.productId.value = '';
  elements.saveProduct.textContent = '新增产品';
}

function generateAndRenderPackages() {
  const budget = Number(elements.budgetInput.value);
  const mode = elements.priceMode.value;
  const maxItems = Number(elements.maxItems.value);
  const count = Number(elements.planCount.value);
  const preferences = selectedPreferenceCategories();

  latestPackages = buildPackages({ budget, mode, maxItems, count, preferences });
  renderPackages(budget, mode);
}

function buildPackages({ budget, mode, maxItems, count, preferences }) {
  if (!budget || products.length === 0) return [];

  const sorted = [...products].sort((a, b) => a[mode] - b[mode]);
  const preferred = preferences.length ? sorted.filter((item) => preferences.includes(item.category)) : sorted;
  const pool = preferred.length >= Math.min(maxItems, 2) ? preferred : sorted;
  const candidates = [];

  for (let start = 0; start < pool.length; start += 1) {
    const chosen = [];
    const categorySet = new Set();
    let total = 0;
    const rotation = [...pool.slice(start), ...pool.slice(0, start)];

    for (const product of rotation) {
      if (chosen.length >= maxItems) break;
      const price = product[mode];
      const categoryPenalty = categorySet.has(product.category) && categorySet.size < Math.min(maxItems, uniqueCategories().length);
      if (total + price <= budget * 1.03 && !categoryPenalty) {
        chosen.push(product);
        categorySet.add(product.category);
        total += price;
      }
    }

    for (const product of rotation) {
      if (chosen.length >= maxItems || total >= budget * 0.86) break;
      if (chosen.some((item) => item.id === product.id)) continue;
      if (total + product[mode] <= budget * 1.03) {
        chosen.push(product);
        total += product[mode];
      }
    }

    if (chosen.length > 0) {
      const diversity = new Set(chosen.map((item) => item.category)).size;
      const utilization = total / budget;
      const score = Math.abs(1 - utilization) - diversity * 0.08 + chosen.length * 0.01;
      candidates.push({ items: chosen, total, score, diversity });
    }
  }

  return dedupePackages(candidates)
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

function renderPackages(budget, mode) {
  if (!latestPackages.length) {
    elements.packageResults.innerHTML = '<div class="empty package-empty">请输入有效预算并至少保留一个产品。</div>';
    elements.plannerStatus.textContent = '暂无可推荐方案。';
    return;
  }

  elements.plannerStatus.textContent = `已基于${mode === 'retail' ? '零售价' : '批发价'}生成 ${latestPackages.length} 套方案。`;
  elements.packageResults.innerHTML = latestPackages.map((pack, index) => {
    const diff = budget - pack.total;
    const diffClass = diff >= 0 ? 'under' : 'over';
    return `
      <article class="package-card">
        <div class="package-topline">
          <span>方案 ${index + 1}</span>
          <strong>${formatCurrency(pack.total)}</strong>
        </div>
        <p class="package-note ${diffClass}">${diff >= 0 ? '剩余' : '超出'} ${formatCurrency(Math.abs(diff))} · ${pack.diversity} 个类别</p>
        <ul>
          ${pack.items.map((item) => `
            <li>
              <span>${escapeHtml(item.name)}<em>${escapeHtml(item.category)}</em></span>
              <strong>${formatCurrency(item[mode])}</strong>
            </li>
          `).join('')}
        </ul>
      </article>
    `;
  }).join('');
}

async function copyPackages() {
  if (!latestPackages.length) return;
  const mode = elements.priceMode.value;
  const text = latestPackages.map((pack, index) => {
    const lines = pack.items.map((item) => `- ${item.name}（${item.category}）：${formatCurrency(item[mode])}`);
    return `方案 ${index + 1}：总价 ${formatCurrency(pack.total)}\n${lines.join('\n')}`;
  }).join('\n\n');

  await navigator.clipboard.writeText(text);
  elements.copyResults.textContent = '已复制';
  setTimeout(() => { elements.copyResults.textContent = '复制方案'; }, 1400);
}

function exportProducts() {
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gift-products.json';
  link.click();
  URL.revokeObjectURL(url);
}

function selectedPreferenceCategories() {
  return Array.from(elements.categoryPreferences.selectedOptions || []).map((option) => option.value);
}

function uniqueCategories() {
  return [...new Set(products.map((product) => product.category))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

function dedupePackages(packages) {
  const seen = new Set();
  return packages.filter((pack) => {
    const key = pack.items.map((item) => item.id).sort().join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatCurrency(value) {
  return `¥${Number(value || 0).toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}
