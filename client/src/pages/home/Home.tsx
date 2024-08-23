import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { GetAssetGroupService, GetAssetRelationsById, GetCustomerByIdService, GetCustomerRelationsById } from "../../services/assets/asset.services";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer } from "../../store/slices/customer.slice";
import { useNavigate } from "react-router-dom";
import { AppState } from "../../interfaces/app-state/app-state";
import { IRelation } from "../../interfaces/relation/relation.interface";
import { SitesDataTable } from "../../components/data-table/Sites-DataTable";
import { setBranch } from "../../store/slices/branch.slice";
import { Loading } from "../../components/loading/Loading";


export function Home() {
  const [relations, setRelations] = useState<IRelation[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const param = new URLSearchParams(window.location.search);
  const branchId = param.get('customer');
  const branch = param.get('branch');
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const customer = useSelector((state: AppState) => state.customer);
  const [branchSelected, setBranchSelected] = useState<any>(null);

  const [branchRelations, setBranchRelations] = useState<IRelation[] | null>(null);
  useEffect(() => {
    setIsLoading(true)
    if (branchId) {
      GetCustomerByIdService(branchId).then((response) => {
        console.log(response)
        if (response) {
          GetCustomerRelationsById(branchId).then((response) => {

            if (branch) {
              setBranchSelected(response.find((relation: any) => relation.to.id === branch))
              console.log(response.find((relation: any) => relation.to.id === branch))
              dispatch(setBranch(response.find((relation: any) => relation.to.id === branch)))
              GetAssetRelationsById(branch).then((response) => {
                if(!response){
                  return
                }
                setBranchRelations(response)
               
              
                
              })
            } else {
              if (response.length === 1) {
                navigate('/dashboard?customer=' + response[0].from.id + '&branch=' + response[0].to.id)
              } else {
                setRelations(response)
              
              }
            }
          })
          return dispatch(setCustomer(response));
        }

        GetAssetGroupService().then(response => {
          if (response.length === 1) {
            dispatch(setCustomer(response.data[0]))
            return navigate('/dashboard?customer=' + response[0].id.id)
          }
          // navigate('/select')
        })
      }).finally(() => setIsLoading(false))
    } else {
      GetAssetGroupService().then(response => {
        if (response.data.length === 1) {
          dispatch(setCustomer(response.data[0]))
          return navigate('/dashboard?customer=' + response[0].id.id)
        }
        navigate('/select')
      }).finally(() => setIsLoading(false))
    }

    if (!branch) {
      setBranchSelected(null)
    }

  }, [branch]);

  function handleSelectBranch(branch: any) {
    setBranchSelected(branch)
    dispatch(setBranch(branch))
    navigate('/dashboard?customer=' + branch.from.id + '&branch=' + branch.to.id)

  }

  return (
   <>
  
    <Layout title={branchSelected ? branchSelected.toName : 'Branches'} >
      {isLoading && (
        <Loading />
      )}
      {
        (!branchSelected && relations) && (
          relations.length > 0 && (
            <>
              <div className="flex items-center">
                {relations.map((relation: any, index: number) => {
                  return (
                    <div key={index} className="bg-white p-4 rounded-md shadow-md flex flex-col items-center gap-4 cursor-pointer" onClick={() => handleSelectBranch(relation)}>
                      {
                        customer?.img ? (
                          <img src={customer.img} alt="logo" className="w-20 h-20 object-cover rounded-md" />
                        ) : (
                          <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-md">
                            <span className="text-gray-400 text-2xl">{relation.toName.charAt(0)}</span>
                          </div>
                        )
                      }
                      <h3 className="text-lg font-bold text-gray-500">{relation.toName}</h3>
                    </div>
                  )
                })}
              </div>
            </>
          )
        )
      }

     {branchRelations && <SitesDataTable  data={branchRelations}/>}

    </Layout>
   </>
  );
}