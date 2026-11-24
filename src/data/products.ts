export type Product = {
  id: number
  name: string
  category: string
  price: number
  description: string
  image: string
  tag?: string
}

const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`

export const categories = ['Geral', 'Clássicos', 'Chocolate', 'Infantil', 'Temáticos', '15 anos', 'Noivas', 'Docinhos']

export const products: Product[] = [
  { id: 1, name: 'Chocolate dos Sonhos', category: 'Chocolate', price: 89.90, description: 'Massa de chocolate, brigadeiro cremoso e ganache.', image: photo('photo-1578985545062-69928b1d9587'), tag: 'Mais pedido' },
  { id: 2, name: 'Jardim Encantado', category: 'Infantil', price: 119.90, description: 'Flores delicadas, cores suaves e acabamento artesanal.', image: photo('photo-1563729784474-d77dbb933a9e'), tag: 'Personalizável' },
  { id: 3, name: 'Clássico das Rosas', category: 'Noivas', price: 249.90, description: 'Bolo elegante com flores e acabamento delicado.', image: photo('photo-1535254973040-607b474cb50d'), tag: 'Sob encomenda' },
  { id: 4, name: 'Red Velvet', category: 'Clássicos', price: 94.90, description: 'Massa aveludada, creme suave e frutas vermelhas.', image: photo('photo-1586788680434-30d324b2d46f') },
  { id: 5, name: 'Festa dos Heróis', category: 'Temáticos', price: 139.90, description: 'Bolo de super-heróis com cores, emblemas e topper personalizado.', image: photo('photo-1558636508-e0db3814bd1d'), tag: 'Tema personalizado' },
  { id: 6, name: 'Naked Cake Floral', category: 'Noivas', price: 279.90, description: 'Visual romântico com flores e frutas da estação.', image: photo('photo-1464349095431-e9a21285b5f3') },
  { id: 7, name: 'Docinhos Finos', category: 'Docinhos', price: 59.90, description: 'Seleção de docinhos para completar sua comemoração.', image: photo('photo-1488477181946-6428a0291777') },
  { id: 8, name: 'Baunilha & Frutas', category: 'Clássicos', price: 84.90, description: 'Leve, delicado e recheado com creme de baunilha.', image: photo('photo-1565958011703-44f9829ba187') },
  { id: 9, name: 'Princesas Encantadas', category: 'Infantil', price: 144.90, description: 'Castelo, coroa e detalhes inspirados em contos de fadas.', image: photo('photo-1557925923-cd4648e211a0'), tag: 'Princesas' },
  { id: 10, name: 'Unicórnio Mágico', category: 'Infantil', price: 134.90, description: 'Arco-íris, estrelinhas e decoração colorida.', image: photo('photo-1563729784474-d77dbb933a9e'), tag: 'Infantil' },
  { id: 11, name: 'Aventura dos Heróis', category: 'Temáticos', price: 149.90, description: 'Tema de herói favorito com escudo, máscara e cores vibrantes.', image: photo('photo-1558636508-e0db3814bd1d'), tag: 'Super-heróis' },
  { id: 12, name: 'Festa de 15 anos', category: '15 anos', price: 289.90, description: 'Design elegante com brilho, flores e acabamento especial.', image: photo('photo-1535254973040-607b474cb50d'), tag: 'Sob encomenda' },
  { id: 13, name: 'Bolo Borboletas', category: '15 anos', price: 219.90, description: 'Composição delicada para uma celebração inesquecível.', image: photo('photo-1464349095431-e9a21285b5f3') },
  { id: 14, name: 'Bolo Minnie Rosa', category: 'Temáticos', price: 129.90, description: 'Laços, poás e tons de rosa para uma festa encantadora.', image: photo('photo-1563729784474-d77dbb933a9e'), tag: 'Personagens' },
  { id: 15, name: 'Casamento Atemporal', category: 'Noivas', price: 329.90, description: 'Andares clássicos, flores naturais e detalhes sofisticados.', image: photo('photo-1535254973040-607b474cb50d'), tag: 'Coleção noivas' },
]
