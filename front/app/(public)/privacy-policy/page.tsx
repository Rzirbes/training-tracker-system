const privacyPolicy = [
  {
    title: 'Introdução',
    value:
      'Estamos comprometidos em proteger sua privacidade. Esta política explica como coletamos, usamos e compartilhamos suas informações pessoais.',
  },
  {
    title: 'Coleta de Informações',
    value:
      'Coletamos diversas informações para proporcionar a melhor experiência na nossa plataforma. Isso inclui: seu nome e e-mail; nome e e-mail dos seus atletas; detalhes sobre as sessões de treinamento; planejamento e execução dos treinos; duração total das sessões; percepção subjetiva de esforço; percepção subjetiva de recuperação; e dados sobre o bem-estar dos atletas.',
  },
  {
    title: 'Uso das Informações',
    value:
      'Utilizamos suas informações para gerenciar sua conta na plataforma, gerar os gráficos de monitoramento dos seus atletas, enviar e-mails relacionados à plataforma e melhorar nossos serviços.',
  },
  {
    title: 'Compartilhamento de Informações',
    value:
      'Não compartilhamos suas informações pessoais com terceiros, exceto conforme necessário para cumprir obrigações legais ou proteger nossos direitos.',
  },
  {
    title: 'Segurança das Informações',
    value:
      'Armazenamos suas informações na infraestrutura da Amazon Web Services (AWS), que implementa medidas de segurança adequadas para proteger suas informações.',
  },
  {
    title: 'Direitos dos Titulares de Dados',
    value:
      'De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de acessar suas informações pessoais, corrigir informações incorretas, solicitar a exclusão de suas informações e retirar seu consentimento para o uso de suas informações.',
  },
  {
    title: 'Contato',
    value:
      'Se você tiver qualquer dúvida sobre esta política de privacidade ou sobre como tratamos suas informações pessoais, entre em contato conosco através do e-mail suporte@training-track-app.com.',
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className='w-full h-full overflow-auto max-h-screen'>
      <section className='text-center max-w-2xl text-balance py-8 mx-auto'>
        <h1 className='text-3xl md:text-2xl text-primary-medium font-bold'>Política de Privacidade</h1>
        <p className='text-xl md:text-lg mt-[6px] mb-8 md:mb-6 text-zinc-600 font-medium text-balance'>
          Bem-vindo à Training Track.
        </p>
        <h2 className='font-semibold text-balance'>
          Esta Política de Privacidade explica como a Training Track coleta, usa e protege suas informações pessoais.
        </h2>
        <ol className='w-full h-full text-left list-decimal font-bold py-8 p-10 md:pl-8 md:pr-0 space-y-4'>
          {privacyPolicy.map(({ title, value }) => (
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
