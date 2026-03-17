const terms = [
  {
    title: 'Aceitação dos Termos',
    value:
      'Ao acessar ou usar nossa plataforma, você concorda em cumprir e estar legalmente vinculado a estes Termos de Uso.',
  },
  {
    title: 'Aceitação dos Termos',
    value:
      'Ao acessar ou usar nossa plataforma, você concorda em cumprir e estar legalmente vinculado a estes Termos de Uso.',
  },
  {
    title: 'Cadastro',
    value:
      'Para utilizar nossos serviços, você precisa criar uma conta fornecendo seu nome e e-mail. Você concorda em fornecer informações precisas, atuais e completas.',
  },
  {
    title: 'Uso da Plataforma',
    value:
      'Você concorda em usar nossa plataforma apenas para fins legais e de acordo com estes Termos. Você é responsável por todas as atividades realizadas em sua conta.',
  },
  {
    title: 'Privacidade',
    value:
      'Nossa Política de Privacidade explica como coletamos, usamos e protegemos suas informações pessoais. Ao usar nossa plataforma, você concorda com a coleta e uso de informações conforme descrito na Política de Privacidade.',
  },
  {
    title: 'Limitação de Responsabilidade',
    value:
      'A Training Track não será responsável por quaisquer danos diretos, indiretos, incidentais, consequenciais ou punitivos decorrentes do uso ou incapacidade de uso da plataforma.',
  },
  {
    title: 'Alterações nos Termos',
    value:
      'Podemos alterar estes Termos de Uso a qualquer momento. As alterações serão publicadas em nosso site e entrarão em vigor imediatamente. Seu uso contínuo da plataforma após a publicação das alterações constitui sua aceitação dos novos Termos de Uso.',
  },
  {
    title: 'Contato',
    value:
      'Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco em suporte@training-track-app.com.',
  },
]

export default function TermsOfUsePage() {
  return (
    <div className='w-full h-full overflow-auto max-h-screen'>
      <section className='w-full h-full text-center max-w-2xl mx-auto text-balance py-8'>
        <h1 className='text-3xl md:text-2xl text-primary-medium font-bold'>Termos de Uso</h1>
        <p className='text-xl md:text-lg mt-[6px] mb-8 md:mb-6 text-zinc-600 font-medium text-balance'>
          Bem-vindo à Training Track.
        </p>
        <h2 className='font-semibold'>
          Estes Termos de Uso regem o uso da nossa plataforma, Training Track, destinada a treinadores e preparadores
          físicos para gerenciar e registrar informações sobre os treinos dos seus atletas.
        </h2>
        <ol className='w-full h-full text-left list-decimal font-bold py-8 p-10 md:pl-8 md:pr-0 space-y-4'>
          {terms.map(({ title, value }) => (
            <li key={title}>
              <p>{title}</p>
              <p className='font-medium'>{value}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
