import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown, ArrowRight, Search, ShoppingBag, Menu, X, Plus, Minus,
  Heart, Instagram, MessageCircle, Truck, ShieldCheck, Star, Cake,
  Sparkles, Send, ChevronDown, WandSparkles, Phone
} from 'lucide-react'
import { categories, products, type Product } from './data/products'

type CartLine = { product: Product; quantity: number }
type CakeForm = { occasion: string; theme: string; size: string; flavor: string; filling: string; date: string; notes: string }

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Configure os canais da loja antes de publicar.
const WHATSAPP_NUMBER = '5500000000000'
const INSTAGRAM_URL = 'https://www.instagram.com/'

export default function App() {
  const [activeCategory, setActiveCategory] = useState('Geral')
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [customOpen, setCustomOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([
    { from: 'bot', text: 'Olá! 🍰 Sou a assistente virtual da IsoldaBolos. Posso ajudar com sabores, personalização, encomendas e prazos. O que você gostaria de saber?' },
  ])
  const [mobileMenu, setMobileMenu] = useState(false)
  const [form, setForm] = useState<CakeForm>({
    occasion: 'Aniversário', theme: '', size: '15 a 20 pessoas', flavor: 'Chocolate',
    filling: 'Brigadeiro', date: '', notes: '',
  })
  const catalogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.13 })
    // Re-observe os elementos sempre que o catálogo mudar de categoria
    // ou de busca. Os cards são recriados pelo React após o filtro.
    document.querySelectorAll('.reveal').forEach(el => {
      if (!el.classList.contains('is-visible')) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [activeCategory, search])

  const visibleProducts = useMemo(() => products.filter(product => {
    const matchesCategory = activeCategory === 'Geral' || product.category === activeCategory
    const matchesSearch = `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  }), [activeCategory, search])

  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0)
  const total = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0)

  const scrollToCatalog = () => catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const whatsapp = (message: string) => window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer'
  )

  const addToCart = (product: Product) => setCart(current => {
    const found = current.find(line => line.product.id === product.id)
    return found
      ? current.map(line => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
      : [...current, { product, quantity: 1 }]
  })
  const changeQuantity = (id: number, delta: number) => setCart(current =>
    current.map(line => line.product.id === id ? { ...line, quantity: line.quantity + delta } : line)
      .filter(line => line.quantity > 0)
  )
  const sendCart = () => {
    const lines = cart.map(line => `${line.quantity}x ${line.product.name} — ${money(line.product.price * line.quantity)}`).join('\\n')
    whatsapp(`Olá! Gostaria de fazer este pedido na IsoldaBolos:\\n${lines}\\n\\nTotal estimado: ${money(total)}\\nGostaria de confirmar disponibilidade e entrega.`)
  }
  const sendCustom = () => {
    whatsapp(`Olá! Gostaria de personalizar um bolo na IsoldaBolos.\\nOcasião: ${form.occasion}\\nTema/personagem: ${form.theme || 'A combinar'}\\nTamanho: ${form.size}\\nMassa: ${form.flavor}\\nRecheio: ${form.filling}\\nData desejada: ${form.date || 'A combinar'}\\nDetalhes: ${form.notes || 'A combinar'}`)
    setCustomOpen(false)
  }

  const replyToChat = () => {
    const question = chatInput.trim()
    if (!question) return
    setChatMessages(current => [...current, { from: 'user', text: question }])
    setChatInput('')
    const q = question.toLowerCase()
    let answer = 'Que bom receber sua mensagem! Para confirmar valores, disponibilidade e detalhes específicos, fale com nossa equipe pelo WhatsApp. Assim conseguimos cuidar do seu pedido com atenção. 💛'
    if (q.includes('preço') || q.includes('valor') || q.includes('custa')) answer = 'Os valores variam conforme tamanho, decoração e recheio. Os preços iniciais estão no catálogo; para um orçamento personalizado, nossa equipe atende pelo WhatsApp. 💛'
    else if (q.includes('prazo') || q.includes('dias') || q.includes('anteced')) answer = 'Recomendamos consultar a disponibilidade com antecedência, especialmente para casamentos e festas. Informe a data pelo WhatsApp para nossa equipe verificar a agenda.'
    else if (q.includes('sabor') || q.includes('recheio')) answer = 'Temos opções como chocolate, baunilha, red velvet, brigadeiro, doce de leite, ninho e frutas vermelhas. Também podemos conversar sobre combinações especiais!'
    else if (q.includes('entrega') || q.includes('frete')) answer = 'Consulte nossa equipe para confirmar a entrega na sua região e o valor do frete. Atendemos pedidos para todo o Brasil sob consulta.'
    else if (q.includes('whatsapp') || q.includes('atendente') || q.includes('pessoa')) answer = 'Claro! Use o botão “Falar pelo WhatsApp” no site para conversar diretamente com nossa equipe.'
    window.setTimeout(() => setChatMessages(current => [...current, { from: 'bot', text: answer }]), 350)
  }

  return (
    <div className="site">
      <div className="announcement">
        <span><Truck size={15}/> Entrega sob consulta</span>
        <span><ShieldCheck size={15}/> Atendimento seguro</span>
        <span><Heart size={15}/> Feito com carinho</span>
        <div className="announcement-social"><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={15}/></a><button onClick={() => whatsapp('Olá! Vim pelo site da IsoldaBolos.')} aria-label="WhatsApp"><MessageCircle size={15}/></button></div>
      </div>

      <header className="header">
        <a className="brand" href="#inicio" aria-label="IsoldaBolos início">
          <span className="brand-mark"><Cake size={38}/><i>♡</i></span>
          <span><strong>Isolda<span>Bolos</span></strong><small>Doce em cada detalhe ♡</small></span>
        </a>
        <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Abrir menu">{mobileMenu ? <X/> : <Menu/>}</button>
        <nav className={mobileMenu ? 'nav nav-open' : 'nav'}>
          <a href="#inicio" onClick={() => setMobileMenu(false)}>Início</a>
          <a href="#conceito" onClick={() => setMobileMenu(false)}>Nossa essência</a>
          <a href="#catalogo" onClick={() => { setMobileMenu(false); scrollToCatalog() }}>Bolos</a>
          <a href="#personalizar" onClick={() => { setMobileMenu(false); setCustomOpen(true) }}>Personalize</a>
          <a href="#contato" onClick={() => setMobileMenu(false)}>Contato</a>
        </nav>
        <div className="header-actions">
          {searchOpen && <input className="header-search-input" autoFocus placeholder="Buscar bolos..." value={search} onChange={e => { setSearch(e.target.value); scrollToCatalog() }} onKeyDown={e => e.key === 'Enter' && scrollToCatalog()}/>}
          <button className="icon-button" aria-label="Pesquisar" onClick={() => { setSearchOpen(!searchOpen); if (!searchOpen) setTimeout(scrollToCatalog, 50) }}><Search/></button>
          <button className="icon-button cart-button" aria-label="Abrir carrinho" onClick={() => setCartOpen(true)}><ShoppingBag/><b>{itemCount}</b></button>
        </div>
      </header>

      <main>
        <section className="intro" id="inicio">
          <div className="intro-image intro-image-one" />
          <div className="intro-image intro-image-two" />
          <div className="intro-vignette"/>
          <div className="intro-content reveal">
            <span className="eyebrow"><Sparkles size={14}/> CONFEITARIA ARTESANAL • FEITA COM AFETO</span>
            <h1>Transforme momentos<br/>em <em>doces memórias.</em></h1>
            <p>Bolos artesanais, temáticos e de celebração, criados com cuidado para fazer parte das histórias mais bonitas da sua vida.</p>
            <button className="button button-gold" onClick={scrollToCatalog}>Conheça nossos bolos <ArrowRight size={17}/></button>
            <a className="scroll-cue" href="#conceito"><span>Role para descobrir</span><ArrowDown size={15}/></a>
          </div>
          <div className="intro-caption">ISOLDA BOLOS <span>—</span> DOCE EM CADA DETALHE</div>
        </section>

        <section className="story section-pad" id="conceito">
          <div className="story-copy reveal">
            <span className="eyebrow">UM BOLO PARA CADA HISTÓRIA</span>
            <h2>Mais que bolos,<br/>criamos <em>lembranças.</em></h2>
            <p>Do primeiro sabor ao último detalhe da decoração, cada criação é pensada para combinar com o seu momento. Escolha uma inspiração ou conte seu sonho para a gente.</p>
            <button className="button button-outline" onClick={scrollToCatalog}>Explorar coleções <ArrowRight size={16}/></button>
          </div>
          <div className="story-photos reveal">
            <img className="story-photo-main" src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=85" alt="Bolo de casamento delicado com flores"/>
            <img className="story-photo-small" src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=85" alt="Bolo artesanal de chocolate"/>
            <span className="photo-note">feito à mão, com amor ♡</span>
          </div>
        </section>

        <section className="occasion-strip reveal">
          <div><Truck/><span><b>Entrega sob consulta</b><small>Consulte sua região</small></span></div>
          <div><ShieldCheck/><span><b>Pedido acompanhado</b><small>Atendimento próximo</small></span></div>
          <div><Star/><span><b>Qualidade em cada detalhe</b><small>Ingredientes selecionados</small></span></div>
          <div><Heart/><span><b>Feito com carinho</b><small>Para o seu momento</small></span></div>
        </section>

        <section className="catalog section-pad" id="catalogo" ref={catalogRef}>
          <div className="section-heading reveal">
            <div><span className="eyebrow">ESCOLHA SUA INSPIRAÇÃO</span><h2>Um universo de <em>sabores.</em></h2><p>Explore nossas coleções e encontre o bolo perfeito para celebrar.</p></div>
            <div className="catalog-search"><Search size={17}/><input aria-label="Buscar no catálogo" placeholder="Buscar um bolo..." value={search} onChange={e => setSearch(e.target.value)}/></div>
          </div>
          <div className="tabs reveal" role="tablist" aria-label="Categorias de bolos">
            {categories.map(item => <button key={item} role="tab" aria-selected={activeCategory === item} className={activeCategory === item ? 'tab active' : 'tab'} onClick={() => setActiveCategory(item)}>{item}</button>)}
          </div>
          <div className="results-line"><span>{visibleProducts.length} {visibleProducts.length === 1 ? 'opção encontrada' : 'opções encontradas'}</span><span>Valores iniciais • consulte personalizações</span></div>
          {visibleProducts.length ? <div className="product-grid">
            {visibleProducts.map((product, index) => <article className="product-card reveal" key={product.id} style={{ transitionDelay: `${(index % 4) * 75}ms` }}>
              <div className="product-image"><img src={product.image} alt={product.name} loading="lazy"/>{product.tag && <span className="product-tag">{product.tag}</span>}<button className="favorite" aria-label={`Adicionar ${product.name} aos favoritos`} onClick={e => e.currentTarget.classList.toggle('liked')}><Heart size={17}/></button></div>
              <div className="product-details"><span>{product.category}</span><h3>{product.name}</h3><p>{product.description}</p><div className="product-buy"><b>{money(product.price)}</b><button onClick={() => addToCart(product)}><Plus size={14}/> Adicionar</button></div></div>
            </article>)}
          </div> : <div className="no-results">Não encontramos bolos com esse filtro. Tente outra categoria ou palavra.</div>}
          <div className="catalog-custom reveal"><div><span className="eyebrow">IMAGINOU? A GENTE CRIA.</span><h3>Seu tema, suas cores,<br/><em>seu bolo.</em></h3><p>Princesas, super-heróis, personagens, flores, festas de 15 anos e muito mais.</p></div><button className="button button-gold" onClick={() => setCustomOpen(true)}>Criar meu bolo <WandSparkles size={17}/></button></div>
        </section>

        <section className="celebrations section-pad">
          <div className="section-heading centered reveal"><span className="eyebrow">MOMENTOS QUE MERECEM SER CELEBRADOS</span><h2>Do primeiro parabéns<br/>ao <em>sim para sempre.</em></h2></div>
          <div className="celebration-grid">
            <article className="celebration-card reveal"><img src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=85" alt="Bolo de aniversário delicado"/><div><span>01 / INFANTIL</span><h3>Pequenos grandes sonhos</h3><p>Personagens, cores e muita imaginação para os pequenos.</p><button onClick={() => {setActiveCategory('Infantil');scrollToCatalog()}}>Ver bolos infantis <ArrowRight size={15}/></button></div></article>
            <article className="celebration-card reveal"><img src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=85" alt="Bolo de festa elegante"/><div><span>02 / 15 ANOS</span><h3>Uma noite inesquecível</h3><p>Elegância, brilho e personalidade em cada camada.</p><button onClick={() => {setActiveCategory('15 anos');scrollToCatalog()}}>Ver coleção 15 anos <ArrowRight size={15}/></button></div></article>
            <article className="celebration-card reveal"><img src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=85" alt="Bolo de noiva branco com flores"/><div><span>03 / NOIVAS</span><h3>O doce do sim</h3><p>Bolos delicados para acompanhar o começo de uma história.</p><button onClick={() => {setActiveCategory('Noivas');scrollToCatalog()}}>Ver bolos de noiva <ArrowRight size={15}/></button></div></article>
          </div>
        </section>

        <section className="personalize section-pad" id="personalizar">
          <div className="personalize-image reveal"><img src="https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=1100&q=85" alt="Bolo de casamento personalizado com flores"/></div>
          <div className="personalize-copy reveal"><span className="eyebrow">DO SEU JEITO, DO SEU MOMENTO</span><h2>Personalize seu <em>bolo.</em></h2><p>Escolha tamanho, massa, recheio, tema e conte pra gente como você sonha com esse momento. Vamos criar algo único?</p><button className="button button-gold" onClick={() => setCustomOpen(true)}>Personalizar agora <ArrowRight size={17}/></button><div className="contact-mini"><MessageCircle size={17}/><span>Prefere conversar? <button onClick={() => whatsapp('Olá! Gostaria de conversar sobre um bolo personalizado.')}>Chame no WhatsApp</button></span></div></div>
        </section>

        <section className="contact-section section-pad" id="contato">
          <div className="contact-panel reveal"><span className="eyebrow">VAMOS CONVERSAR?</span><h2>Seu próximo momento<br/>especial começa <em>aqui.</em></h2><p>Consulte datas, tire dúvidas e peça seu orçamento. Será um prazer fazer parte da sua celebração.</p><div className="contact-links"><button className="button button-gold" onClick={() => whatsapp('Olá! Vim pelo site da IsoldaBolos e gostaria de fazer um pedido.')}><MessageCircle size={17}/> Falar pelo WhatsApp</button><a className="button button-outline" href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><Instagram size={17}/> Acompanhar no Instagram</a></div></div>
        </section>
      </main>

      <footer className="footer"><a className="brand" href="#inicio"><span className="brand-mark"><Cake size={34}/></span><span><strong>Isolda<span>Bolos</span></strong><small>Doce em cada detalhe ♡</small></span></a><p>Transformando momentos em doces memórias.</p><div className="footer-social"><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram/></a><button onClick={() => whatsapp('Olá! Gostaria de falar com a IsoldaBolos.')} aria-label="WhatsApp"><MessageCircle/></button></div><small className="copyright">© {new Date().getFullYear()} IsoldaBolos. Feito com carinho.</small></footer>

      <button className="floating-chat" onClick={() => setChatOpen(true)} aria-label="Abrir assistente virtual"><MessageCircle/><span>Posso ajudar?</span></button>

      {cartOpen && <div className="overlay" onMouseDown={e => {if (e.target === e.currentTarget) setCartOpen(false)}}><aside className="drawer"><div className="drawer-head"><div><span className="eyebrow">SEUS FAVORITOS</span><h2>Sua sacolinha</h2></div><button className="icon-button" onClick={() => setCartOpen(false)}><X/></button></div>
        {!cart.length ? <p className="empty-cart">Sua sacolinha ainda está vazia. Que tal escolher um bolo especial?</p> : <>{cart.map(line => <div className="cart-line" key={line.product.id}><img src={line.product.image} alt=""/><div className="cart-line-info"><b>{line.product.name}</b><span>{money(line.product.price)}</span><div className="quantity"><button onClick={() => changeQuantity(line.product.id,-1)}><Minus size={13}/></button>{line.quantity}<button onClick={() => changeQuantity(line.product.id,1)}><Plus size={13}/></button></div></div><b>{money(line.product.price * line.quantity)}</b></div>)}<div className="cart-total"><div><span>Total estimado</span><b>{money(total)}</b></div><small>Valores e disponibilidade serão confirmados pela equipe.</small><button className="button button-gold" onClick={sendCart}>Enviar pedido pelo WhatsApp <ArrowRight size={16}/></button></div></>}
      </aside></div>}

      {customOpen && <div className="overlay modal-overlay" onMouseDown={e => {if(e.target===e.currentTarget)setCustomOpen(false)}}><section className="custom-modal"><div className="drawer-head"><div><span className="eyebrow">VAMOS CRIAR JUNTOS</span><h2>Seu bolo especial</h2></div><button className="icon-button" onClick={() => setCustomOpen(false)}><X/></button></div><p className="modal-intro">Conte um pouquinho sobre o que você imaginou. Nossa equipe continua o atendimento pelo WhatsApp.</p><div className="form-grid">
        <label>Ocasião<select value={form.occasion} onChange={e=>setForm({...form,occasion:e.target.value})}>{['Aniversário','Infantil','Festa de 15 anos','Casamento','Chá de bebê','Batizado','Outra comemoração'].map(v=><option key={v}>{v}</option>)}</select></label>
        <label>Tema ou personagem<input value={form.theme} onChange={e=>setForm({...form,theme:e.target.value})} placeholder="Ex.: princesa, herói, flores..."/></label>
        <label>Tamanho<select value={form.size} onChange={e=>setForm({...form,size:e.target.value})}>{['10 a 15 pessoas','15 a 20 pessoas','20 a 30 pessoas','30 a 50 pessoas','Mais de 50 pessoas'].map(v=><option key={v}>{v}</option>)}</select></label>
        <label>Massa<select value={form.flavor} onChange={e=>setForm({...form,flavor:e.target.value})}>{['Chocolate','Baunilha','Red Velvet','Cenoura','A combinar'].map(v=><option key={v}>{v}</option>)}</select></label>
        <label>Recheio<select value={form.filling} onChange={e=>setForm({...form,filling:e.target.value})}>{['Brigadeiro','Doce de leite','Ninho','Frutas vermelhas','Prestígio','A combinar'].map(v=><option key={v}>{v}</option>)}</select></label>
        <label>Data desejada<input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label>
        <label className="full-field">Detalhes adicionais<textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Cores, decoração, número de andares, referências..."/></label>
      </div><button className="button button-gold modal-submit" onClick={sendCustom}>Enviar pelo WhatsApp <ArrowRight size={16}/></button></section></div>}

      {chatOpen && <div className="chat-window"><div className="chat-head"><div className="chat-avatar"><Cake size={19}/></div><div><b>Assistente IsoldaBolos</b><small><i/> Atendimento virtual</small></div><button onClick={() => setChatOpen(false)} aria-label="Fechar chat"><X/></button></div><div className="chat-body">{chatMessages.map((message,index)=><div key={index} className={message.from === 'bot' ? 'chat-bubble bot' : 'chat-bubble user'}>{message.text}</div>)}<div className="quick-questions"><button onClick={() => setChatInput('Quais sabores vocês têm?')}>Sabores</button><button onClick={() => setChatInput('Qual o prazo para encomendar?')}>Prazos</button><button onClick={() => setChatInput('Como faço um orçamento?')}>Orçamento</button></div></div><form className="chat-compose" onSubmit={e=>{e.preventDefault();replyToChat()}}><input value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="Escreva sua dúvida..."/><button aria-label="Enviar mensagem"><Send size={17}/></button></form><small className="chat-disclaimer">Assistente demonstrativo. Para informações confirmadas, fale com nossa equipe.</small></div>}
    </div>
  )
}
