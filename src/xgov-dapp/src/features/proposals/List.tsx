import { useEffect, useState } from "react";

const modules = import.meta.glob('../../../../xgov-proposals/Proposals/*.md')
console.log(modules)
function ProposalInfo({path}: {path: string}) {
  const [name, setName]= useState<string|null>(null)
  const [error, setIsError] = useState<Error|null>(null)
  const [data, setData] = useState<any|null>(null)
  useEffect(() => {
    const _name = path.split('/').pop()?.replace('.md', '')
    if(!_name) return
    setName(_name);
    import(`../../../../xgov-proposals/Proposals/${_name}.md`)
      .then(setData)
      .catch(setIsError)
  },[setData, setIsError, path])
  console.log(name)

  if(error) return (<div>Error loading proposal {error.message}</div>)
  if(!data) return (<div>Loading...</div>);

  return (
    <p>
      <a href={`/proposals/${name}`}>{data.attributes.title}</a>
    </p>
  )

}
export function ProposalsList() {
  return <div>
    {Object.keys(modules).map((key) => {
      return <ProposalInfo path={key} />
    })}
  </div>;
}
