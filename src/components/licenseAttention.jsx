function LicenseAttention({title,attenstion1, attention2}){
    return <div className="mainLicenseAtention">
        <div className="pictureLicenseAttenstion">
            <i className="fa fa-3x fa-info-circle" style={{color:"white"}}></i>
            <p >{title}</p>
        </div>
<div className="atentionLicense">
<p>{attenstion1}</p>
        <p>{attention2}</p>
</div>
    </div>
}
export default LicenseAttention