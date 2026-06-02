const productStorageKey = 'gift-quotation-products-v2';
const quoteStorageKey = 'gift-quotation-quotes-v1';

const packageTemplates = [
  { name: '端午节福利', categories: ['粽子礼盒', '茶饮冲调', '健康食品'], note: '适合端午员工福利、客户拜访，突出节日氛围。' },
  { name: '中秋节福利', categories: ['月饼礼盒', '坚果礼盒', '茶饮冲调'], note: '适合中秋福利和商务送礼，可搭配月饼、茶叶、坚果。' },
  { name: '春节福利', categories: ['年货礼盒', '农产品礼盒', '粮油副食'], note: '适合春节团拜和员工年货，强调实用和体面。' },
  { name: '银行伴手礼', categories: ['商务伴手礼', '茶饮冲调', '数码办公'], note: '适合银行网点活动、VIP 客户回馈，偏精致轻便。' },
  { name: '企业团购', categories: ['企业团购', '日用福利', '健康食品'], note: '适合大批量采购，优先控制成本与配送效率。' },
  { name: '扶贫产品组合', categories: ['扶贫农产品', '农产品礼盒', '粮油副食'], note: '适合助农、工会福利、党建活动，突出产地和社会价值。' },
  { name: '饭堂食材组合', categories: ['饭堂食材', '粮油副食', '生鲜冷链'], note: '适合饭堂、食堂补给，强调稳定供应和配送方式。' }
];

const sampleProducts = [
  makeProduct('五芳斋粽子礼盒', '五芳斋', '1.2kg/盒', '粽子礼盒', 78, 98, 138, '盒', 240, '常温快递', '端午热销，咸甜组合', ''),
  makeProduct('岭南荔枝干礼盒', '粤礼优选', '500g/盒', '农产品礼盒', 42, 62, 98, '盒', 380, '常温快递', '广东特色农产品，可做扶贫组合', ''),
  makeProduct('有机大米礼袋', '稻香源', '5kg/袋', '粮油副食', 46, 58, 89, '袋', 520, '物流配送', '饭堂与春节福利均适用', ''),
  makeProduct('山茶油礼盒', '赣南山礼', '750ml×2', '粮油副食', 92, 118, 168, '盒', 160, '物流配送', '高客单价，适合春节福利', ''),
  makeProduct('广式月饼礼盒', '莲香楼', '720g/盒', '月饼礼盒', 96, 128, 188, '盒', 300, '常温快递', '中秋经典款，可企业定制贺卡', ''),
  makeProduct('坚果每日礼盒', '沃隆', '750g/盒', '坚果礼盒', 68, 88, 128, '盒', 450, '常温快递', '大众接受度高，适合多预算组合', ''),
  makeProduct('陈皮普洱茶礼盒', '新会陈礼', '300g/盒', '茶饮冲调', 65, 88, 139, '盒', 220, '常温快递', '商务伴手礼，适合银行客户', ''),
  makeProduct('即食燕麦组合', '健康谷', '1.5kg/箱', '健康食品', 38, 52, 79, '箱', 600, '常温快递', '健康轻食，可做员工福利补充品', ''),
  makeProduct('商务保温杯', '膳魔师', '500ml/个', '商务伴手礼', 72, 96, 158, '个', 180, '常温快递', '可印企业 Logo，适合客户活动', ''),
  makeProduct('无线充电办公套装', '倍思', '充电器+线材', '数码办公', 55, 78, 129, '套', 260, '常温快递', '银行和科技企业伴手礼常用', ''),
  makeProduct('清远鸡冷链礼盒', '清远农家', '1只装', '生鲜冷链', 58, 76, 118, '盒', 120, '冷链配送', '需要提前确认配送城市', ''),
  makeProduct('饭堂蔬菜组合', '绿篮子', '10kg/箱', '饭堂食材', 52, 65, 82, '箱', 800, '同城配送', '饭堂日配，适合批量采购', ''),
  makeProduct('扶贫蜂蜜礼盒', '山里甜', '500g×2', '扶贫农产品', 48, 68, 108, '盒', 330, '常温快递', '助农产品，适合工会和党建活动', ''),
  makeProduct('家庭年货坚果礼包', '良品铺子', '1.8kg/箱', '年货礼盒', 118, 148, 218, '箱', 210, '常温快递', '春节员工福利大礼包', ''),
  makeProduct('洗护日用套装', '蓝月亮', '洗衣液+洗手液', '日用福利', 62, 82, 119, '套', 500, '物流配送', '实用型福利，适合企业团购', ''),
  makeProduct('企业团购水果券', '鲜果到家', '300元券', '企业团购', 210, 245, 300, '张', 1000, '电子券', '预算明确，适合大客户批量发放', '')
];

let products = loadProducts();
let savedQuotes = loadQuotes();
let latestPackages = [];
let selectedPackageIndex = 0;

const elements = {
  productCount: document.querySelector('#product-count'),
  categoryCount: document.querySelector('#category-count'),
  stockCount: document.querySelector('#stock-count'),
  avgMargin: document.querySelector('#avg-margin'),
  plannerForm: document.querySelector('#planner-form'),
  customerName: document.querySelector('#customer-name'),
  budgetInput: document.querySelector('#budget-input'),
  packageName: document.querySelector('#package-name'),
  templateSelect: document.querySelector('#template-select'),
  targetMargin: document.querySelector('#target-margin'),
  packagingFee: document.querySelector('#packaging-fee'),
  deliveryFee: document.querySelector('#delivery-fee'),
  taxRate: document.querySelector('#tax-rate'),
  planCount: document.querySelector('#plan-count'),
  serviceNote: document.querySelector('#service-note'),
  plannerStatus: document.querySelector('#planner-status'),
  packageResults: document.querySelector('#package-results'),
  copyResults: document.querySelector('#copy-results'),
  templateList: document.querySelector('#template-list'),
  productForm: document.querySelector('#product-form'),
  productId: document.querySelector('#product-id'),
  productName: document.querySelector('#product-name'),
  productBrand: document.querySelector('#product-brand'),
  productSpec: document.querySelector('#product-spec'),
  productCategory: document.querySelector('#product-category'),
  categoryOptions: document.querySelector('#category-options'),
  costPrice: document.querySelector('#cost-price'),
  wholesalePrice: document.querySelector('#wholesale-price'),
  retailPrice: document.querySelector('#retail-price'),
  productUnit: document.querySelector('#product-unit'),
  productStock: document.querySelector('#product-stock'),
  deliveryMethod: document.querySelector('#delivery-method'),
  imageUrl: document.querySelector('#image-url'),
  productNote: document.querySelector('#product-note'),
  saveProduct: document.querySelector('#save-product'),
  productTable: document.querySelector('#product-table'),
  searchProducts: document.querySelector('#search-products'),
  filterCategory: document.querySelector('#filter-category'),
  importFile: document.querySelector('#import-file'),
  exportProducts: document.querySelector('#export-products'),
  resetProducts: document.querySelector('#reset-products')
};

renderTemplateControls();
renderAll();
generateAndRenderPackages();

elements.plannerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  generateAndRenderPackages();
});

elements.budgetInput.addEventListener('input', generateAndRenderPackages);
elements.templateSelect.addEventListener('change', () => {
  const template = currentTemplate();
  if (template && !elements.packageName.value.trim()) elements.packageName.value = template.name;
  generateAndRenderPackages();
});

document.querySelectorAll('[data-budget]').forEach((button) => {
  button.addEventListener('click', () => {
    elements.budgetInput.value = button.dataset.budget;
    generateAndRenderPackages();
  });
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

elements.packageResults.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-package-index]');
  if (!button) return;
  selectedPackageIndex = Number(button.dataset.packageIndex);
  renderPackages(Number(elements.budgetInput.value));
});

elements.searchProducts.addEventListener('input', renderProductTable);
elements.filterCategory.addEventListener('change', renderProductTable);
elements.copyResults.addEventListener('click', copySelectedQuote);
elements.exportProducts.addEventListener('click', exportData);
elements.importFile.addEventListener('change', importData);
elements.resetProducts.addEventListener('click', () => {
  products = sampleProducts.map((product) => ({ ...product, id: crypto.randomUUID() }));
  savedQuotes = [];
  persistProducts();
  persistQuotes();
  clearProductForm();
  renderAll();
  generateAndRenderPackages();
});

function makeProduct(name, brand, spec, category, cost, wholesale, retail, unit, stock, delivery, note, imageUrl) {
  return {
    id: crypto.randomUUID(),
    name,
    brand,
    spec,
    category,
    cost,
    wholesale,
    retail,
    unit,
    stock,
    delivery,
    note,
    imageUrl
  };
}

function normalizeProduct(product) {
  return {
    id: product.id || crypto.randomUUID(),
    name: product.name || '未命名产品',
    brand: product.brand || '',
    spec: product.spec || '',
    category: product.category || product.tags || '未分类',
    cost: Number(product.cost ?? product.wholesale ?? 0),
    wholesale: Number(product.wholesale ?? product.cost ?? 0),
    retail: Number(product.retail ?? product.wholesale ?? 0),
    unit: product.unit || '件',
    stock: Number(product.stock || 0),
    delivery: product.delivery || product.deliveryMethod || '常温快递',
    note: product.note || product.tags || '',
    imageUrl: product.imageUrl || ''
  };
}

function loadProducts() {
  const saved = localStorage.getItem(productStorageKey) || localStorage.getItem('gift-quotation-products-v1');
  if (!saved) return sampleProducts;

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.map(normalizeProduct) : sampleProducts;
  } catch {
    return sampleProducts;
  }
}

function loadQuotes() {
  const saved = localStorage.getItem(quoteStorageKey);
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistProducts() {
  localStorage.setItem(productStorageKey, JSON.stringify(products));
}

function persistQuotes() {
  localStorage.setItem(quoteStorageKey, JSON.stringify(savedQuotes));
}

function renderAll() {
  renderMetrics();
  renderCategoryControls();
  renderProductTable();
}

function renderMetrics() {
  const categories = uniqueCategories();
  const totalStock = products.reduce((sum, item) => sum + Number(item.stock || 0), 0);
  const margins = products
    .filter((item) => item.retail > 0)
    .map((item) => (item.retail - item.cost) / item.retail);
  const averageMargin = margins.reduce((sum, margin) => sum + margin, 0) / (margins.length || 1);

  elements.productCount.textContent = products.length;
  elements.categoryCount.textContent = categories.length;
  elements.stockCount.textContent = totalStock.toLocaleString('zh-CN');
  elements.avgMargin.textContent = formatPercent(averageMargin);
}

function renderTemplateControls() {
  elements.templateSelect.innerHTML = packageTemplates
    .map((template) => `<option value="${escapeHtml(template.name)}">${escapeHtml(template.name)}</option>`)
    .join('');
  elements.templateList.innerHTML = packageTemplates.map((template) => `
    <article class="template-item">
      <strong>${escapeHtml(template.name)}</strong>
      <span>${template.categories.map(escapeHtml).join(' / ')}</span>
      <p>${escapeHtml(template.note)}</p>
    </article>
  `).join('');
  elements.packageName.value = packageTemplates[0].name;
}

function renderCategoryControls() {
  const categories = uniqueCategories();
  elements.categoryOptions.innerHTML = categories
    .map((category) => `<option value="${escapeHtml(category)}"></option>`)
    .join('');
  const currentFilter = elements.filterCategory.value;
  elements.filterCategory.innerHTML = '<option value="all">全部分类</option>' + categories
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join('');
  elements.filterCategory.value = categories.includes(currentFilter) ? currentFilter : 'all';
}

function renderProductTable() {
  const keyword = elements.searchProducts.value.trim().toLowerCase();
  const category = elements.filterCategory.value;
  const rows = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const haystack = `${product.name} ${product.brand} ${product.spec} ${product.category} ${product.delivery} ${product.note}`.toLowerCase();
    return matchesCategory && haystack.includes(keyword);
  });

  elements.productTable.innerHTML = rows.map((product) => `
    <tr>
      <td data-label="产品">
        <strong>${escapeHtml(product.name)}</strong>
        ${product.imageUrl ? `<a class="image-link" href="${escapeHtml(product.imageUrl)}" target="_blank" rel="noreferrer">查看图片</a>` : ''}
      </td>
      <td data-label="品牌/规格">${escapeHtml(product.brand || '—')}<small>${escapeHtml(product.spec || '—')}</small></td>
      <td data-label="分类"><span class="pill">${escapeHtml(product.category)}</span></td>
      <td data-label="价格">
        <span>成本 ${formatCurrency(product.cost)}</span>
        <span>批发 ${formatCurrency(product.wholesale)}</span>
        <span>零售 ${formatCurrency(product.retail)}</span>
      </td>
      <td data-label="库存">${Number(product.stock || 0).toLocaleString('zh-CN')} ${escapeHtml(product.unit || '')}</td>
      <td data-label="配送">${escapeHtml(product.delivery || '—')}</td>
      <td data-label="备注">${escapeHtml(product.note || '—')}</td>
      <td data-label="操作" class="actions">
        <button type="button" class="small" data-action="edit" data-id="${product.id}">编辑</button>
        <button type="button" class="small danger" data-action="delete" data-id="${product.id}">删除</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="8" class="empty">暂无匹配产品，请调整搜索条件或新增产品。</td></tr>';
}

function saveProduct() {
  const product = normalizeProduct({
    id: elements.productId.value || crypto.randomUUID(),
    name: elements.productName.value.trim(),
    brand: elements.productBrand.value.trim(),
    spec: elements.productSpec.value.trim(),
    category: elements.productCategory.value.trim(),
    cost: Number(elements.costPrice.value),
    wholesale: Number(elements.wholesalePrice.value),
    retail: Number(elements.retailPrice.value),
    unit: elements.productUnit.value.trim() || '件',
    stock: Number(elements.productStock.value),
    delivery: elements.deliveryMethod.value.trim(),
    note: elements.productNote.value.trim(),
    imageUrl: elements.imageUrl.value.trim()
  });

  if (!product.name || !product.category || product.cost < 0 || product.wholesale < 0 || product.retail < 0) return;

  const existingIndex = products.findIndex((item) => item.id === product.id);
  if (existingIndex >= 0) {
    products[existingIndex] = product;
  } else {
    products = [product, ...products];
  }

  persistProducts();
  clearProductForm();
  renderAll();
  generateAndRenderPackages();
}

function editProduct(product) {
  elements.productId.value = product.id;
  elements.productName.value = product.name;
  elements.productBrand.value = product.brand;
  elements.productSpec.value = product.spec;
  elements.productCategory.value = product.category;
  elements.costPrice.value = product.cost;
  elements.wholesalePrice.value = product.wholesale;
  elements.retailPrice.value = product.retail;
  elements.productUnit.value = product.unit;
  elements.productStock.value = product.stock;
  elements.deliveryMethod.value = product.delivery;
  elements.imageUrl.value = product.imageUrl;
  elements.productNote.value = product.note;
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
  elements.productStock.value = 0;
  elements.saveProduct.textContent = '新增产品';
}

function generateAndRenderPackages() {
  const budget = Number(elements.budgetInput.value);
  const settings = currentSettings();
  latestPackages = buildPackages(settings);
  selectedPackageIndex = Math.min(selectedPackageIndex, Math.max(latestPackages.length - 1, 0));
  renderPackages(budget);
}

function currentSettings() {
  return {
    customerName: elements.customerName.value.trim() || '贵公司',
    budget: Number(elements.budgetInput.value),
    packageName: elements.packageName.value.trim() || currentTemplate().name,
    template: currentTemplate(),
    targetMargin: Number(elements.targetMargin.value),
    packagingFee: Number(elements.packagingFee.value),
    deliveryFee: Number(elements.deliveryFee.value),
    taxRate: Number(elements.taxRate.value),
    count: Number(elements.planCount.value),
    serviceNote: elements.serviceNote.value.trim()
  };
}

function currentTemplate() {
  return packageTemplates.find((template) => template.name === elements.templateSelect.value) || packageTemplates[0];
}

function buildPackages(settings) {
  if (!settings.budget || products.length === 0) return [];

  const fixedFees = settings.packagingFee + settings.deliveryFee;
  const maxSubtotal = Math.max(settings.budget - fixedFees, 1) / (1 + settings.taxRate);
  const preferred = products.filter((item) => settings.template.categories.includes(item.category));
  const pool = (preferred.length >= 2 ? preferred : products)
    .filter((item) => item.stock > 0 && item.wholesale <= maxSubtotal)
    .sort((a, b) => a.wholesale - b.wholesale);
  const candidates = [];
  const maxItems = 5;

  for (let start = 0; start < pool.length; start += 1) {
    const rotation = [...pool.slice(start), ...pool.slice(0, start)];
    const lines = [];
    const usedCategories = new Set();
    let subtotal = 0;

    for (const product of rotation) {
      if (lines.length >= maxItems) break;
      if (usedCategories.has(product.category) && usedCategories.size < Math.min(maxItems, settings.template.categories.length)) continue;
      const quantity = suggestQuantity(product, maxSubtotal - subtotal, settings.budget);
      if (quantity < 1) continue;
      const lineWholesale = product.wholesale * quantity;
      if (subtotal + lineWholesale <= maxSubtotal) {
        lines.push({ product, quantity });
        subtotal += lineWholesale;
        usedCategories.add(product.category);
      }
    }

    for (const product of rotation) {
      if (lines.length >= maxItems || subtotal >= maxSubtotal * 0.9) break;
      if (lines.some((line) => line.product.id === product.id)) continue;
      const quantity = suggestQuantity(product, maxSubtotal - subtotal, settings.budget);
      if (quantity < 1) continue;
      const lineWholesale = product.wholesale * quantity;
      if (subtotal + lineWholesale <= maxSubtotal) {
        lines.push({ product, quantity });
        subtotal += lineWholesale;
      }
    }

    if (lines.length) candidates.push(calculatePackage(lines, settings));
  }

  return dedupePackages(candidates)
    .filter((pack) => pack.quote <= settings.budget)
    .sort((a, b) => a.score - b.score)
    .slice(0, settings.count);
}

function suggestQuantity(product, remainingBudget, budget) {
  if (product.wholesale <= 45 && budget >= 300 && remainingBudget >= product.wholesale * 2) return 2;
  return remainingBudget >= product.wholesale ? 1 : 0;
}

function calculatePackage(lines, settings) {
  const subtotal = lines.reduce((sum, line) => sum + line.product.wholesale * line.quantity, 0);
  const productCost = lines.reduce((sum, line) => sum + line.product.cost * line.quantity, 0);
  const taxFee = subtotal * settings.taxRate;
  const totalCost = productCost + settings.packagingFee + settings.deliveryFee + taxFee;
  const quote = subtotal + settings.packagingFee + settings.deliveryFee + taxFee;
  const grossProfit = quote - totalCost;
  const grossMargin = quote > 0 ? grossProfit / quote : 0;
  const utilization = quote / settings.budget;
  const categoryBonus = new Set(lines.map((line) => line.product.category)).size * 0.04;
  const score = Math.abs(settings.targetMargin - grossMargin) + Math.abs(0.96 - utilization) - categoryBonus;

  return {
    name: settings.packageName,
    customerName: settings.customerName,
    templateName: settings.template.name,
    lines,
    subtotal,
    productCost,
    packagingFee: settings.packagingFee,
    deliveryFee: settings.deliveryFee,
    taxFee,
    totalCost,
    quote,
    grossProfit,
    grossMargin,
    score,
    serviceNote: settings.serviceNote,
    deliveryNote: summarizeDelivery(lines)
  };
}

function renderPackages(budget) {
  if (!latestPackages.length) {
    elements.packageResults.innerHTML = '<div class="empty package-empty">当前预算或产品库无法生成不超预算方案，请降低费用、补充低价产品或提高预算。</div>';
    elements.plannerStatus.textContent = '暂无可推荐方案。';
    return;
  }

  const selected = latestPackages[selectedPackageIndex] || latestPackages[0];
  savedQuotes = [selected, ...savedQuotes].slice(0, 12);
  persistQuotes();
  elements.plannerStatus.textContent = `已生成 ${latestPackages.length} 套不超预算方案，当前选中毛利率 ${formatPercent(selected.grossMargin)}。`;
  elements.packageResults.innerHTML = latestPackages.map((pack, index) => {
    const diff = budget - pack.quote;
    return `
      <article class="package-card ${index === selectedPackageIndex ? 'selected' : ''}">
        <div class="package-topline">
          <span>${escapeHtml(pack.templateName)} · 方案 ${index + 1}</span>
          <strong>${formatCurrency(pack.quote)}</strong>
        </div>
        <p class="package-note under">未超预算，剩余 ${formatCurrency(diff)} · 毛利 ${formatCurrency(pack.grossProfit)} / ${formatPercent(pack.grossMargin)}</p>
        <div class="quote-summary">
          <span>总成本 ${formatCurrency(pack.totalCost)}</span>
          <span>包装 ${formatCurrency(pack.packagingFee)}</span>
          <span>配送 ${formatCurrency(pack.deliveryFee)}</span>
          <span>税费 ${formatCurrency(pack.taxFee)}</span>
        </div>
        <ul>
          ${pack.lines.map((line) => `
            <li>
              <span>${escapeHtml(line.product.name)}<em>${escapeHtml(line.product.brand)} · ${escapeHtml(line.product.spec)} · ${line.quantity}${escapeHtml(line.product.unit)}</em></span>
              <strong>${formatCurrency(line.product.wholesale * line.quantity)}</strong>
            </li>
          `).join('')}
        </ul>
        <button type="button" class="small ${index === selectedPackageIndex ? 'secondary' : ''}" data-package-index="${index}">${index === selectedPackageIndex ? '已选中文案' : '选择此方案'}</button>
      </article>
    `;
  }).join('');
}

async function copySelectedQuote() {
  const pack = latestPackages[selectedPackageIndex] || latestPackages[0];
  if (!pack) return;
  await navigator.clipboard.writeText(makeCustomerQuoteText(pack));
  elements.copyResults.textContent = '已复制微信文案';
  setTimeout(() => { elements.copyResults.textContent = '复制客户报价文案'; }, 1400);
}

function makeCustomerQuoteText(pack) {
  const lines = pack.lines.map((line, index) => `${index + 1}. ${line.product.name}（${line.product.brand || '精选品牌'}，${line.product.spec || '标准规格'}）× ${line.quantity}${line.product.unit || '件'}`);
  return `${pack.customerName}您好，给您整理了【${pack.name}】报价方案：\n\n产品清单：\n${lines.join('\n')}\n\n套餐总价：${formatCurrency(pack.quote)}/套\n配送说明：${pack.deliveryNote}\n服务说明：${pack.serviceNote || '支持按预算、人数和收货地址进一步调整。'}\n\n如需我按 200/300/400/500 元预算再细分几个版本，也可以继续为您调整。`;
}

function exportData() {
  const payload = {
    version: 2,
    exportedAt: new Date().toISOString(),
    products,
    quotes: savedQuotes,
    templates: packageTemplates
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gift-quotation-data.json';
  link.click();
  URL.revokeObjectURL(url);
}

async function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const text = await file.text();
  const parsed = JSON.parse(text);
  const importedProducts = Array.isArray(parsed) ? parsed : parsed.products;
  products = importedProducts.map(normalizeProduct);
  savedQuotes = Array.isArray(parsed.quotes) ? parsed.quotes : [];
  persistProducts();
  persistQuotes();
  renderAll();
  generateAndRenderPackages();
  event.target.value = '';
}

function summarizeDelivery(lines) {
  const methods = [...new Set(lines.map((line) => line.product.delivery).filter(Boolean))];
  return methods.length ? methods.join(' / ') : '按客户地址安排快递或物流配送';
}

function uniqueCategories() {
  return [...new Set(products.map((product) => product.category))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

function dedupePackages(packages) {
  const seen = new Set();
  return packages.filter((pack) => {
    const key = pack.lines.map((line) => `${line.product.id}:${line.quantity}`).sort().join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatCurrency(value) {
  return `¥${Number(value || 0).toLocaleString('zh-CN', { maximumFractionDigits: 2 })}`;
}

function formatPercent(value) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
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
