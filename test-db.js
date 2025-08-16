// Script de prueba para verificar la conexión a Supabase
const { createClient } = require('@supabase/supabase-js');

// Verificar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Variables de entorno:');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? 'Configurada' : 'No configurada');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno no configuradas');
  process.exit(1);
}

// Crear cliente
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n🔍 Probando conexión a Supabase...');
    
    // Probar conexión básica
    const { data, error } = await supabase.from('clientes').select('count').limit(1);
    
    if (error) {
      console.error('❌ Error de conexión:', error.message);
      return;
    }
    
    console.log('✅ Conexión exitosa a Supabase');
    
    // Probar consultas a las tablas
    console.log('\n📊 Probando consultas a las tablas...');
    
    // Clientes
    const { data: clientes, error: clientesError } = await supabase
      .from('clientes')
      .select('*')
      .limit(5);
    
    if (clientesError) {
      console.error('❌ Error consultando clientes:', clientesError.message);
    } else {
      console.log(`✅ Clientes: ${clientes?.length || 0} registros encontrados`);
    }
    
    // Productos
    const { data: productos, error: productosError } = await supabase
      .from('productos')
      .select('*')
      .limit(5);
    
    if (productosError) {
      console.error('❌ Error consultando productos:', productosError.message);
    } else {
      console.log(`✅ Productos: ${productos?.length || 0} registros encontrados`);
    }
    
    // Ventas
    const { data: ventas, error: ventasError } = await supabase
      .from('ventas')
      .select('*')
      .limit(5);
    
    if (ventasError) {
      console.error('❌ Error consultando ventas:', ventasError.message);
    } else {
      console.log(`✅ Ventas: ${ventas?.length || 0} registros encontrados`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testConnection(); 